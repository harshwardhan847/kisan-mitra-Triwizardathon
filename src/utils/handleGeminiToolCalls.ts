import { getMarketData } from "@/tools/getMarketData";
import { compareStateMarketData } from "@/tools/compareMandiPrices";
import { getGovernmentSchemes } from "@/tools/getGovernmentSchemes";
import { diagnoseCropDisease } from "@/tools/diagnoseCropDisease";
import { FunctionResponseScheduling } from "@google/genai";
import type { ToolResponse } from "@/components/DashboardView";
import type { PreviousChats } from "@/types/tool_types";

interface HandleGeminiToolCallsParams {
  toolCall: any;
  setLoading?: (loading: { active: boolean; toolName?: string }) => void;
  onMarketDataReceived: (data: ToolResponse) => void;
  onRequestImageForDiagnosis?: (cb: (image: string) => void) => void;
  previousChats: PreviousChats;
  currentLanguage: string;
}

export async function handleGeminiToolCalls({
  toolCall,
  setLoading,
  onMarketDataReceived,
  onRequestImageForDiagnosis,
  previousChats,
  currentLanguage,
}: HandleGeminiToolCallsParams) {
  const functionResponses: any[] = [];

  if (setLoading)
    setLoading({
      active: true,
      toolName: toolCall.functionCalls?.[0]?.name || "Tool",
    });

  await Promise.all(
    toolCall.functionCalls.map(async (fc: any) => {
      let toolResult: any;
      switch (fc.name) {
        case "get_market_data":
          if (fc.args && typeof fc.args.commodityName === "string") {
            toolResult = await getMarketData(
              fc.args.commodityName,
              fc.args.state,
              fc.args.district,
              fc.args.market,
              fc.args.arrivalDate,
              fc.args.startDate,
              fc.args.endDate,
              previousChats,
              currentLanguage
            );
            onMarketDataReceived(toolResult);
          } else {
            toolResult = {
              error:
                "Missing or invalid 'commodityName' argument for get_market_data.",
            };
            onMarketDataReceived(toolResult);
          }
          break;
        case "compare_state_market_data":
          if (
            fc.args &&
            typeof fc.args.commodityName === "string" &&
            (Array.isArray(fc.args.states) || Array.isArray(fc.args.district))
          ) {
            const regions =
              Array.isArray(fc.args.states) && fc.args.states.length > 0
                ? fc.args.states
                : fc.args.district;
            toolResult = await compareStateMarketData(
              fc.args.commodityName,
              regions,
              fc.args.arrivalDate,
              fc.args.startDate,
              fc.args.endDate,
              previousChats,
              currentLanguage
            );
            onMarketDataReceived(toolResult);
          } else {
            toolResult = {
              error:
                "Missing or invalid arguments for compare_state_market_data. Must provide commodityName and at least one of states or district.",
            };
            onMarketDataReceived(toolResult);
          }
          break;
        case "get_government_schemes":
          if (
            fc.args &&
            typeof fc.args.query === "string" &&
            typeof fc.args.location === "string"
          ) {
            toolResult = await getGovernmentSchemes(
              fc.args.query,
              fc.args.location,
              currentLanguage,
              previousChats
            );
          } else {
            toolResult = {
              error:
                "Missing or invalid arguments for get_government_schemes. Must provide query and location.",
            };
          }
          onMarketDataReceived(toolResult);
          break;
        case "diagnose_crop_disease":
          if (onRequestImageForDiagnosis) {
            // Defer execution to UI for image capture
            await new Promise<void>((resolve) => {
              onRequestImageForDiagnosis(async (image: string) => {
                if (!image) return;
                try {
                  const toolResult = await diagnoseCropDisease(
                    image,
                    currentLanguage,
                    previousChats
                  );
                  onMarketDataReceived(toolResult);
                  functionResponses.push({
                    id: fc.id,
                    name: fc.name,
                    response: {
                      result: toolResult,
                      scheduling: FunctionResponseScheduling.INTERRUPT,
                    },
                  });
                } catch (err) {
                  functionResponses.push({
                    id: fc.id,
                    name: fc.name,
                    response: {
                      result: { error: "Image diagnosis failed." },
                      scheduling: FunctionResponseScheduling.INTERRUPT,
                    },
                  });
                }
                resolve();
              });
            });
            break;
          } else if (fc.args && typeof fc.args.image === "string") {
            if (!fc.args.image) return;
            const toolResult = await diagnoseCropDisease(
              fc.args.image,
              currentLanguage,
              previousChats
            );
            onMarketDataReceived(toolResult);
            functionResponses.push({
              id: fc.id,
              name: fc.name,
              response: {
                result: toolResult,
                scheduling: FunctionResponseScheduling.INTERRUPT,
              },
            });
          } else {
            const toolResult = {
              error:
                "Missing or invalid arguments for diagnose_crop_disease. Must provide image.",
            };
            onMarketDataReceived(toolResult);
            functionResponses.push({
              id: fc.id,
              name: fc.name,
              response: {
                result: toolResult,
                scheduling: FunctionResponseScheduling.INTERRUPT,
              },
            });
          }
          break;
        default:
          toolResult = { error: `Unknown tool: ${fc.name}` };
          onMarketDataReceived(toolResult);
      }
      functionResponses.push({
        id: fc.id,
        name: fc.name,
        response: {
          result: toolResult,
          scheduling: FunctionResponseScheduling.INTERRUPT,
        },
      });
    })
  );

  if (setLoading) setLoading({ active: false });
  return functionResponses;
}
