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
// =============================================================================
// Regex Patterns
// =============================================================================
/**
 * Matches tool calls in Claude's response.
 * Captures: [1] tool name, [2] parameters content
 *
 * Pattern breakdown:
 * - <invoke\s+name="([^"]+)"> - Opening tag with tool name
 * - ([\s\S]*?) - Non-greedy capture of all parameters
 * - </invoke> - Closing tag
 */
export const TOOL_CALL_REGEX = /<invoke\s+name="([^"]+)">([\s\S]*?)<\/antml:invoke>/g;
/**
 * Matches individual parameters within a tool call.
 * Captures: [1] parameter name, [2] parameter value
 */
export const PARAMETER_REGEX = /<parameter\s+name="([^"]+)">([\s\S]*?)<\/antml:parameter>/g;
/**
 * Matches tool results in the response.
 * Captures: [1] tool call ID, [2] result content
 */
export const TOOL_RESULT_REGEX = /<tool_result\s+tool_call_id="([^"]+)"(?:\s+is_error="(true|false)")?>([\s\S]*?)<\/antml:tool_result>/g;
/**
 * Matches the entire function_calls block for stripping.
 * Used to remove tool call XML from display content.
 */
export const STRIP_TOOL_CALL_REGEX = /<function_calls>[\s\S]*?<\/antml:function_calls>/g;
/**
 * Matches tool result blocks for stripping.
 * Used to remove tool results from display content.
 */
export const STRIP_TOOL_RESULTS_REGEX = /<tool_result[\s\S]*?<\/antml:tool_result>/g;
// =============================================================================
// Parsing Functions
// =============================================================================
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
export function parseToolCalls(text) {
    const calls = [];
    // Reset regex lastIndex for fresh matching
    TOOL_CALL_REGEX.lastIndex = 0;
    let match;
    while ((match = TOOL_CALL_REGEX.exec(text)) !== null) {
        const [rawXml, name, paramsContent] = match;
        // Parse parameters
        const parameters = {};
        PARAMETER_REGEX.lastIndex = 0;
        let paramMatch;
        while ((paramMatch = PARAMETER_REGEX.exec(paramsContent)) !== null) {
            const [, paramName, paramValue] = paramMatch;
            parameters[paramName] = paramValue;
        }
        calls.push({
            name,
            parameters,
            rawXml,
        });
    }
    return calls;
}
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
export function parseToolResults(text) {
    const results = [];
    // Reset regex lastIndex for fresh matching
    TOOL_RESULT_REGEX.lastIndex = 0;
    let match;
    while ((match = TOOL_RESULT_REGEX.exec(text)) !== null) {
        const [, toolCallId, isErrorAttr, content] = match;
        results.push({
            toolCallId,
            content: content.trim(),
            isError: isErrorAttr === 'true',
        });
    }
    return results;
}
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
export function stripToolXml(text) {
    return text
        .replace(STRIP_TOOL_CALL_REGEX, '')
        .replace(STRIP_TOOL_RESULTS_REGEX, '')
        .trim();
}
/**
 * Check if text contains any tool calls.
 *
 * Useful for conditional rendering or processing logic.
 *
 * @param text - Text to check
 * @returns True if text contains tool call XML
 */
export function hasToolCalls(text) {
    TOOL_CALL_REGEX.lastIndex = 0;
    return TOOL_CALL_REGEX.test(text);
}
/**
 * Check if text contains any tool results.
 *
 * @param text - Text to check
 * @returns True if text contains tool result XML
 */
export function hasToolResults(text) {
    TOOL_RESULT_REGEX.lastIndex = 0;
    return TOOL_RESULT_REGEX.test(text);
}
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
export function matchToolResults(toolCalls, resultText) {
    const results = parseToolResults(resultText);
    const resultMap = new Map(results.map((r) => [r.toolCallId, r]));
    return toolCalls.map((call) => {
        const result = resultMap.get(call.id);
        if (result) {
            return {
                ...call,
                result: result.content,
                success: !result.isError,
                error: result.isError ? result.content : undefined,
            };
        }
        return call;
    });
}
//# sourceMappingURL=tool-xml.js.map