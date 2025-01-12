# AiCodeCalc Quick Start Guide

## What is AiCodeCalc?
AiCodeCalc helps you evaluate and implement AI-powered code development by calculating costs, efficiency, and resource requirements. It compares traditional human development with AI-assisted development using advanced LLM models.

## 5-Minute Setup

### Prerequisites
- Node.js v18+
- npm or bun
- Git

### Installation
```bash
# Clone repository
git clone https://github.com/ruvnet/AiCodeCalc.git
cd AiCodeCalc

# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
open http://localhost:3000
```

## Quick Configuration Steps

### 1. Project Setup
- Enter your project's total lines of code
- Select complexity level (Simple/Moderate/Complex/High-verbosity)
- Set development timeline
- **Detailed guide**: See [Project Setup Module](TUTORIAL.md#1-project-setup-module)

### 2. LLM Configuration
Default configuration (recommended for first project):
- GPT-4o: 60% usage
- GPT-4o-mini: 40% usage
- **Detailed guide**: See [LLM Configuration](TUTORIAL.md#2-llm-configuration)

### 3. Agent Configuration
Start with Single Agent mode for your first project:
- Set agent count to 1
- Use static resource allocation
- Enable debug mode for monitoring
- **Detailed guide**: See [Agent Configuration](TUTORIAL.md#3-agent-configuration)

### 4. Human Development Metrics
Enter your team's metrics:
- Team size
- Average hourly rate
- Lines of code per day
- Meeting and overhead time
- **Detailed guide**: See [Human Development Integration](TUTORIAL.md#4-human-development-integration)

### 5. Review Results
Analyze the comparison:
- Cost analysis
- Time savings
- Resource utilization
- Token usage
- **Detailed guide**: See [Results Analysis](TUTORIAL.md#5-results-analysis)

## Next Steps

### Optimization
1. Review the [Best Practices](TUTORIAL.md#best-practices) section
2. Experiment with different agent modes
3. Fine-tune model allocation
4. Monitor and adjust based on results

### Advanced Features
- Multi-agent configuration
- Memory management
- Resource optimization
- Communication protocols
- **Full details**: See [Advanced Configuration](TUTORIAL.md#advanced-configuration)

### Common Issues
If you encounter problems, check:
1. [Troubleshooting Guide](TUTORIAL.md#troubleshooting-guide)
2. [GitHub Issues](https://github.com/ruvnet/AiCodeCalc/issues)
3. [Community Support](https://github.com/ruvnet/AiCodeCalc/discussions)

## Getting Help
- Read the full [Tutorial](TUTORIAL.md)
- Join our [Community](https://github.com/ruvnet/AiCodeCalc/discussions)
- Report issues on [GitHub](https://github.com/ruvnet/AiCodeCalc/issues)

Remember: Start small, monitor results, and gradually increase AI involvement as you become more comfortable with the system.
