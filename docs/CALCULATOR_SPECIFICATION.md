# AiCodeCalc Calculator Specification

## Overview

This document provides a comprehensive specification of the mathematical models, formulas, and calculations used in the AiCodeCalc system for estimating LLM-based development costs and comparing them with traditional human development costs.

## Core Parameters

### Project Parameters
```typescript
interface ProjectParameters {
  totalLoc: number;           // Total lines of code
  complexity: ComplexityLevel;// Language/domain complexity
  timeline: number;           // Project timeline in days
}
```

### LLM Cost Parameters
```typescript
interface LLMCostParameters {
  inputTokenCost: number;     // Cost per 1000 input tokens (Cin)
  outputTokenCost: number;    // Cost per 1000 output tokens (Cout)
  tokensPerLoc: number;      // Average tokens per line of code (r)
  inputTokenFraction: number; // Fraction of tokens that are input (βin)
}
```

### Overhead Factors
```typescript
interface OverheadFactors {
  agenticOverhead: number;    // Iteration overhead factor (α)
  retryFactor: number;        // Retry/error factor (ε)
  bugFixOverhead: number;     // Bug-fix overhead factor (δ)
  testingOverhead: number;    // Testing overhead factor (γ)
}
```

### Human Development Parameters
```typescript
interface HumanDevParameters {
  hourlyRate: number;         // Cost per hour (CostHumanHourly)
  locPerDay: number;         // Lines of code per day (LoCHumanDay)
  errorRate: number;         // Errors per KLoC (ErrorsPerLoCHuman)
  teamSize: number;          // Number of developers
}
```

## Mathematical Models

### 1. Combined Overhead Factor (Ω)

The composite overhead factor combines all individual overhead multipliers:

```typescript
Ω = α × ε × δ × γ

where:
α = Agentic overhead (1.0 - 3.0)
ε = Retry factor (typically 1.1 - 2.0)
δ = Bug-fix overhead (typically 1.1 - 2.0)
γ = Testing overhead (typically 1.1 - 2.0)
```

### 2. Token Calculations

#### 2.1 Total Tokens with Overhead
```typescript
TcodeTotal = Ω × LoC × r

where:
Ω = Combined overhead factor
LoC = Total lines of code
r = Tokens per line of code
```

#### 2.2 Input/Output Token Split
```typescript
Tin = βin × TcodeTotal
Tout = (1 - βin) × TcodeTotal

where:
βin = Input token fraction (typically 0.3)
```

### 3. Cost Calculations

#### 3.1 Single Model Cost
```typescript
CostProject = (Tin/1000) × Cin + (Tout/1000) × Cout

where:
Cin = Cost per 1000 input tokens
Cout = Cost per 1000 output tokens
```

#### 3.2 Multi-Model Cost
```typescript
For each model m:
Costm = (βinm × θm × Ωm × LoC × r/1000) × Cinm +
        ((1 - βinm) × θm × Ωm × LoC × r/1000) × Coutm

Total Cost = Σ Costm

where:
θm = Usage fraction for model m
Ωm = Overhead factor for model m
Cinm, Coutm = Cost rates for model m
```

### 4. Error and Retry Calculations

#### 4.1 Detailed Retry Factor
```typescript
ε = 1 + pfail × nretries

where:
pfail = Probability of failure/invalid response
nretries = Average number of extra attempts per failure
```

### 5. Human Development Calculations

#### 5.1 Development Timeline
```typescript
DaysHuman = LoC / LoCHumanDay
```

#### 5.2 Human Development Cost
```typescript
CostHumanTotal = DaysHuman × 8 × CostHumanHourly × TeamSize
```

## Implementation Guidelines

### 1. Real-time Calculation Flow

```typescript
interface CalculationFlow {
  1. Validate inputs
  2. Calculate overhead factors
  3. Compute token requirements
  4. Calculate LLM costs
  5. Calculate human comparison
  6. Update UI with results
}
```

### 2. Validation Rules

```typescript
const ValidationRules = {
  LoC: { min: 1, max: 1000000 },
  α: { min: 1.0, max: 3.0 },
  ε: { min: 1.0, max: 2.0 },
  δ: { min: 1.0, max: 2.0 },
  γ: { min: 1.0, max: 2.0 },
  βin: { min: 0.0, max: 1.0 },
  tokensPerLoc: { min: 1, max: 20 }
};
```

### 3. Default Values

```typescript
const DefaultValues = {
  α: 1.5,        // Moderate agentic overhead
  ε: 1.1,        // 10% retry rate
  δ: 1.2,        // 20% bug-fix overhead
  γ: 1.3,        // 30% testing overhead
  βin: 0.3,      // 30% input tokens
  tokensPerLoc: 5 // 5 tokens per LoC average
};
```

## Calculation Examples

### Example 1: Basic Project Calculation
```typescript
Input:
- LoC = 10000
- α = 1.5
- ε = 1.1
- δ = 1.2
- γ = 1.3
- r = 5 tokens/LoC
- βin = 0.3
- Cin = $0.005
- Cout = $0.015

Calculations:
1. Ω = 1.5 × 1.1 × 1.2 × 1.3 = 2.574
2. TcodeTotal = 2.574 × 10000 × 5 = 128,700 tokens
3. Tin = 0.3 × 128,700 = 38,610 tokens
4. Tout = 0.7 × 128,700 = 90,090 tokens
5. Cost = (38,610/1000 × $0.005) + (90,090/1000 × $0.015)
     = $1.54 + $1.35
     = $2.89
```

### Example 2: Human Comparison
```typescript
Input:
- LoC = 10000
- LoCHumanDay = 50
- CostHumanHourly = $80
- TeamSize = 1

Calculations:
1. DaysHuman = 10000 / 50 = 200 days
2. CostHumanTotal = 200 × 8 × $80 × 1 = $128,000
```

## Performance Optimization

### 1. Calculation Optimizations
- Memoize intermediate results
- Debounce real-time calculations
- Use efficient math operations

### 2. Update Strategies
- Batch UI updates
- Calculate only changed values
- Use progressive enhancement

## Error Handling

### 1. Input Validation
- Range checking
- Type validation
- Dependency validation

### 2. Calculation Error Handling
- Handle division by zero
- Check for overflow
- Validate results

## Future Extensions

### 1. Additional Metrics
- ROI calculations
- Break-even analysis
- Sensitivity analysis

### 2. Advanced Features
- Custom overhead factors
- Model comparison tools
- Cost optimization suggestions
