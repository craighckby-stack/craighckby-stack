import { Anthropic } from '@anthropic-ai/sdk';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

export interface CliAgentConfig {
  workingDirectory: string;
  enableThinking: boolean;
  budgetTokens: number;
}

export class ClaudeCodeAgent {
  private client: Anthropic;
  private mcpClient: Client;

  constructor(private config: CliAgentConfig) {
    this.client = new Anthropic();
    this.mcpClient = new Client({ name: "claude-code-cli", version: "0.2.14" }, { capabilities: {} });
  }

  async initializeMcpServers(): Promise<void> {
    const transport = new StdioClientTransport({
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-filesystem", this.config.workingDirectory]
    });
    await this.mcpClient.connect(transport);
    console.log("[CLAUDE-CODE-ACTIVE] MCP Filesystem Server connected successfully.");
  }

  async executeTask(prompt: string): Promise<string> {
    const response = await this.client.messages.create({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 16000,
      thinking: this.config.enableThinking ? { type: "enabled", budget_tokens: this.config.budgetTokens } : undefined,
      messages: [{ role: "user", content: prompt }]
    });

    return response.content[0].type === 'text' ? response.content[0].text : '';
  }
}