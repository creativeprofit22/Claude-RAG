/**
 * Tool XML Parsing Utilities
 *
 * Shared utilities for parsing Claude's tool calling XML format.
 * Handles both tool calls (antml:invoke) and tool results (antml:tool_result).
 *
 * Used by:
 * - API routes (chat/route.ts) for parsing tool calls from Claude responses
 * - UI components (ChatDrawer.tsx) for displaying tool results and stripping XML
 */
/**
 * Parsed tool call from Claude's response
 */
export interface ParsedToolCall {
    /** Tool name from the invoke element */
    name: string;
    /** Parameters passed to the tool */
    parameters: Record<string, string>;
    /** Raw XML of the tool call for debugging */
    rawXml: string;
}
/**
 * Tool call result with status
 */
export interface ToolCall {
    /** Unique identifier for this tool call */
    id: string;
    /** Tool name that was called */
    name: string;
    /** Input parameters */
    input: Record<string, string>;
    /** Result content after execution */
    result?: string;
    /** Whether the tool call succeeded */
    success?: boolean;
    /** Error message if failed */
    error?: string;
}
/**
 * Parsed tool result from XML
 */
export interface ParsedToolResult {
    /** Tool call ID */
    toolCallId: string;
    /** Result content */
    content: string;
    /** Whether the result indicates an error */
    isError: boolean;
}
/**
 * Matches tool calls in Claude's response.
 * Captures: [1] tool name, [2] parameters content
 *
 * Pattern breakdown:
 * - <invoke\s+name="([^"]+)"> - Opening tag with tool name
 * - ([\s\S]*?) - Non-greedy capture of all parameters
 * - </invoke> - Closing tag
 */
export declare const TOOL_CALL_REGEX: RegExp;
/**
 * Matches individual parameters within a tool call.
 * Captures: [1] parameter name, [2] parameter value
 */
export declare const PARAMETER_REGEX: RegExp;
/**
 * Matches tool results in the response.
 * Captures: [1] tool call ID, [2] result content
 */
export declare const TOOL_RESULT_REGEX: RegExp;
/**
 * Matches the entire function_calls block for stripping.
 * Used to remove tool call XML from display content.
 */
export declare const STRIP_TOOL_CALL_REGEX: RegExp;
/**
 * Matches tool result blocks for stripping.
 * Used to remove tool results from display content.
 */
export declare const STRIP_TOOL_RESULTS_REGEX: RegExp;
/**
 * Parse tool calls from Claude's response text.
 *
 * Extracts all tool invocations from the response, including their
 * parameters. Handles multiple tool calls in a single response.
 *
 * @param text - Raw response text containing tool call XML
 * @returns Array of parsed tool calls
 *
 * @example
 * ```ts
 * const calls = parseToolCalls(response);
 * for (const call of calls) {
 *   console.log(`Tool: ${call.name}`);
 *   console.log(`Params: ${JSON.stringify(call.parameters)}`);
 * }
 * ```
 */
export declare function parseToolCalls(text: string): ParsedToolCall[];
/**
 * Parse tool results from response text.
 *
 * Extracts tool execution results that can be displayed to users
 * or used for further processing.
 *
 * @param text - Response text containing tool result XML
 * @returns Array of parsed tool results
 *
 * @example
 * ```ts
 * const results = parseToolResults(response);
 * for (const result of results) {
 *   if (result.isError) {
 *     console.error(`Tool ${result.toolCallId} failed: ${result.content}`);
 *   }
 * }
 * ```
 */
export declare function parseToolResults(text: string): ParsedToolResult[];
/**
 * Strip tool XML from text for display purposes.
 *
 * Removes both tool call blocks and tool result blocks from the
 * response text, leaving only the natural language content for
 * display to users.
 *
 * @param text - Text containing tool XML
 * @returns Clean text without tool XML
 *
 * @example
 * ```ts
 * const displayText = stripToolXml(response);
 * // displayText contains only the conversational content
 * ```
 */
export declare function stripToolXml(text: string): string;
/**
 * Check if text contains any tool calls.
 *
 * Useful for conditional rendering or processing logic.
 *
 * @param text - Text to check
 * @returns True if text contains tool call XML
 */
export declare function hasToolCalls(text: string): boolean;
/**
 * Check if text contains any tool results.
 *
 * @param text - Text to check
 * @returns True if text contains tool result XML
 */
export declare function hasToolResults(text: string): boolean;
/**
 * Extract tool calls and update ToolCall objects with results.
 *
 * Matches tool results back to their original calls by ID,
 * updating the calls with result content and success status.
 *
 * @param toolCalls - Array of tool calls to update
 * @param resultText - Text containing tool result XML
 * @returns Updated tool calls with results populated
 */
export declare function matchToolResults(toolCalls: ToolCall[], resultText: string): ToolCall[];
//# sourceMappingURL=tool-xml.d.ts.map