# WingMate AI — Python Colab Implementation

[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/ydnaincy/wingmate-ai/blob/main/CodeBloom_CodeBase.ipynb)
[![Python](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Accuracy](https://img.shields.io/badge/accuracy-87.4%25-success.svg)](#performance-metrics)

> Complete implementation of the WingMate AI recommendation system in Google Colab with comprehensive data analysis, model training, and evaluation pipelines.

## 📋 Table of Contents

- [Overview](#-overview)
- [Quick Start](#-quick-start)
- [Notebook Structure](#-notebook-structure)
- [Data Requirements](#-data-requirements)
- [Implementation Details](#-implementation-details)
- [Output Files](#-output-files)
- [Performance Analysis](#-performance-analysis)
- [Usage Instructions](#-usage-instructions)
- [Troubleshooting](#-troubleshooting)

## 🎯 Overview

The `CodeBloom_CodeBase.ipynb` notebook provides a complete end-to-end implementation of the WingMate AI recommendation system, featuring:

- **Data Preprocessing & EDA**: Comprehensive exploratory data analysis with visualizations
- **Multi-Context Co-Visitation**: Implementation of the core recommendation algorithm
- **Model Evaluation**: Rigorous testing with multiple evaluation metrics
- **Output Generation**: Production-ready recommendation files
- **Performance Visualization**: Business intelligence dashboards

## 🚀 Quick Start

### Option 1: Google Colab (Recommended)
[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/ydnaincy/wingmate-ai/blob/main/CodeBloom_CodeBase.ipynb)

1. Click the "Open in Colab" button above
2. Upload your data files to the Colab environment
3. Run all cells sequentially
4. Download generated output files

### Option 2: Local Jupyter Environment

```bash
# Clone the repository
git clone https://github.com/ydnaincy/wingmate-ai.git
cd wingmate-ai

# Install dependencies
pip install -r requirements.txt

# Launch Jupyter
jupyter notebook CodeBloom_CodeBase.ipynb
```

## 📊 Notebook Structure

### Section 1: Environment Setup & Data Loading
```python
# Key imports and configuration
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from tqdm import tqdm
```

### Section 2: Exploratory Data Analysis (EDA)
- **Data Quality Assessment**: Missing values, duplicates, data types
- **Cart Size Distribution**: Customer purchasing behavior patterns
- **Item Popularity Analysis**: Long-tail distribution visualization
- **Context Analysis**: Channel, store, and occasion patterns
- **Temporal Patterns**: Order trends over time

### Section 3: Data Preprocessing Pipeline
- **Data Cleaning**: Standardization and normalization
- **Feature Engineering**: Context extraction and encoding
- **Train/Test Split**: Temporal validation methodology
- **Co-visitation Matrix Construction**: Multi-dimensional relationship building

### Section 4: Model Implementation
- **Core Algorithm**: Multi-context co-visitation scoring
- **Weight Optimization**: Hyperparameter tuning across contexts
- **Candidate Generation**: Efficient recommendation candidate selection
- **Diversity Enhancement**: MMR-based recommendation diversification

### Section 5: Evaluation & Validation
- **Strict Leave-One-Out**: Rigorous accuracy testing
- **Temporal Validation**: Future order prediction performance
- **Multiple Metrics**: Recall@K, MAP@K, NDCG@K evaluation
- **Confidence Calibration**: Business confidence thresholds

### Section 6: Output Generation
- **Recommendation Files**: Excel format with multiple recommendation tiers
- **Performance Reports**: Detailed accuracy and coverage metrics
- **Visualization Exports**: Business intelligence charts and graphs

## 📋 Data Requirements

### Input Data Schema

Your data file should contain the following columns:

| Column Name | Data Type | Description | Example |
|-------------|-----------|-------------|---------|
| `CUSTOMER_ID` | String | Unique customer identifier | "CUST_12345" |
| `ORDER_ID` | String | Unique order identifier | "ORD_67890" |
| `ORDER_CHANNEL_NAME` | String | Sales channel | "Online", "Retail" |
| `ORDER_SUBCHANNEL_NAME` | String | Channel subdivision | "Mobile App", "Website" |
| `ORDER_OCCASION_NAME` | String | Purchase occasion | "Birthday", "Regular" |
| `STORE_NUMBER` | String | Physical store ID | "ST001" |
| `CUSTOMER_TYPE` | String | Customer segment | "Premium", "Standard" |
| `ORDERS` | String | Pipe-delimited item list | "Item A\|Item B\|Item C" |

### Data Quality Requirements
- **Minimum Records**: 10,000+ orders for reliable patterns
- **Item Coverage**: 1,000+ unique items recommended
- **Context Distribution**: Balanced representation across all context dimensions
- **Temporal Span**: Minimum 6 months of historical data

## 🔧 Implementation Details

### Core Algorithm Configuration

```python
# Optimized weight configuration
CONTEXT_WEIGHTS = {
    'global': 0.51,      # Universal item affinities
    'channel': 0.24,     # Online/offline patterns
    'store': 0.17,       # Location-specific preferences
    'occasion': 0.11,    # Event-driven purchasing
    'customer_type': 0.10, # Segment behaviors
    'subchannel': 0.05   # Granular channel variations
}

# Performance parameters
CANDIDATE_POOL_SIZE = 120
MMR_LAMBDA = 0.93
BACKOFF_ALPHA = 0.15
```

### Key Functions

#### 1. Co-visitation Matrix Construction
```python
def build_covisitation_matrices(data, contexts):
    """
    Builds normalized co-visitation matrices for each context
    
    Args:
        data: Preprocessed order data
        contexts: List of context dimensions
    
    Returns:
        Dictionary of sparse co-visitation matrices
    """
```

#### 2. Multi-Context Scoring
```python
def calculate_recommendation_scores(cart_items, covis_matrices, weights):
    """
    Calculates weighted recommendation scores across all contexts
    
    Args:
        cart_items: Current cart contents
        covis_matrices: Dictionary of co-visitation matrices
        weights: Context weight configuration
    
    Returns:
        Ranked recommendation candidates with scores
    """
```

#### 3. Evaluation Pipeline
```python
def evaluate_recommendations(test_data, model, metrics=['recall', 'map', 'ndcg']):
    """
    Comprehensive evaluation across multiple metrics
    
    Args:
        test_data: Hold-out test dataset
        model: Trained recommendation model
        metrics: List of evaluation metrics
    
    Returns:
        Performance results dictionary
    """
```

## 📄 Output Files

### 1. Recommendation Output Files

#### `CodeBloom_RecommendationOutputSheet_MAX.xlsx`
- **Configuration**: Maximum accuracy optimization
- **Use Case**: High-precision recommendations for premium customers
- **Performance**: 87.16% top-1 accuracy

#### `CodeBloom_RecommendationOutputSheet_TUNED.xlsx`
- **Configuration**: Balanced accuracy-diversity optimization
- **Use Case**: General customer base with diversity requirements
- **Performance**: 85.2% top-1 accuracy, improved diversity

### 2. Analysis Files

#### Data Processing Outputs
- `codebase_cleaning_EDA.csv`: Cleaned and processed dataset
- `recommendation_output_max.csv`: Raw recommendation scores (max accuracy)
- `recommendation_output_tuned.csv`: Raw recommendation scores (tuned version)

### 3. Visualization Assets
- Cart size distribution histograms
- Item popularity long-tail curves
- Context contribution analysis
- Performance calibration charts

## 📈 Performance Analysis

### Key Metrics Achieved

| Configuration | Recall@1 | Recall@2 | Recall@3 | MAP@3 | NDCG@3 |
|---------------|----------|----------|----------|-------|--------|
| **MAX** (Accuracy-focused) | 87.16% | 87.38% | 87.40% | 87.28% | 87.31% |
| **TUNED** (Balanced) | 85.20% | 85.45% | 85.62% | 85.35% | 85.41% |

### Business Impact Metrics
- **Coverage**: 99.8% of test cases receive recommendations
- **Diversity**: 23% improvement in intra-list diversity (TUNED vs MAX)
- **Processing Speed**: <2 seconds per 1000 recommendations
- **Scalability**: Linear scaling tested up to 1M orders

## 📊 Visualizations

The system generates comprehensive business intelligence visualizations:

### Cart Size Distribution
![Cart Size Distribution](images/images/cart_size_hist.png)
*Peak at 6-item carts (350K orders) with exponential decay. Optimizes for typical customer purchasing patterns.*

### Item Popularity Long Tail  
![Long Tail Distribution](images/images/long_tail.png)
*Classic power-law distribution enables effective cold-start handling through popularity-based backfill strategies.*

### Context Contribution Weights
![Context Weights](images/images/context_weights%20(1).png) 
*Global patterns dominate (51%), followed by channel context (24%). Store-level personalization provides significant lift (17%).*

### Confidence Calibration
![Confidence Calibration](images/images/confidence_calibration.png)
*Well-calibrated confidence scores enable business confidence thresholds and A/B testing frameworks.*

### Lift Curve Analysis
![Lift Curve](images/images/lift_curve.png)
*14% lift over random recommendations in top-confidence decile, enabling targeted deployment strategies.*


## 📝 Usage Instructions

### Step-by-Step Execution

1. **Data Upload**
   ```python
   # Upload your data file to Colab
   from google.colab import files
   uploaded = files.upload()
   ```

2. **Configuration**
   ```python
   # Set your data file path
   DATA_PATH = 'your_order_data.csv'
   TEST_PATH = 'your_test_data.csv'  # Optional
   
   # Choose configuration
   CONFIG = 'MAX'  # or 'TUNED'
   ```

3. **Execute Pipeline**
   ```python
   # Run the complete pipeline
   %run -i "Complete Pipeline Execution"
   ```

4. **Download Results**
   ```python
   # Download recommendation files
   files.download('CodeBloom_RecommendationOutputSheet_MAX.xlsx')
   files.download('CodeBloom_RecommendationOutputSheet_TUNED.xlsx')
   ```

### Configuration Options

#### For Maximum Accuracy (MAX Configuration)
```python
OPTIMIZATION_TARGET = 'accuracy'
DIVERSITY_PENALTY = 0.0
CANDIDATE_POOL = 120
```

#### For Balanced Performance (TUNED Configuration)
```python
OPTIMIZATION_TARGET = 'balanced'
DIVERSITY_PENALTY = 0.07
CANDIDATE_POOL = 100
MMR_ENABLED = True
```

## 🔧 Troubleshooting

### Common Issues & Solutions

#### 1. Memory Limitations
**Issue**: Out of memory errors with large datasets
**Solution**:
```python
# Enable memory optimization
MEMORY_EFFICIENT_MODE = True
BATCH_SIZE = 10000  # Process in smaller batches
```

#### 2. Sparse Data Warning
**Issue**: Low co-visitation coverage in some contexts
**Solution**:
```python
# Increase backoff alpha for sparse contexts
BACKOFF_ALPHA = 0.20
MIN_COVISITATION_THRESHOLD = 2
```

#### 3. Long Processing Times
**Issue**: Slow execution on large datasets
**Solution**:
```python
# Optimize candidate pool size
CANDIDATE_POOL_SIZE = 80  # Reduce from 120
ENABLE_EARLY_STOPPING = True
```

### Data Quality Checks

#### Pre-processing Validation
```python
# Check data quality
def validate_data_quality(df):
    print(f"Total orders: {len(df)}")
    print(f"Unique customers: {df['CUSTOMER_ID'].nunique()}")
    print(f"Unique items: {df['ORDERS'].str.split('|').explode().nunique()}")
    print(f"Missing values: {df.isnull().sum().sum()}")
```

#### Context Coverage Analysis
```python
# Ensure balanced context representation
context_coverage = df.groupby(['ORDER_CHANNEL_NAME', 'STORE_NUMBER']).size()
print("Context distribution:")
print(context_coverage.describe())
```

## 🎯 Business Applications

### Deployment Scenarios

#### 1. E-commerce Cross-selling
- **Integration Point**: Shopping cart page
- **Trigger**: Items added to cart
- **Output**: Top-3 complementary product suggestions

#### 2. Inventory Planning
- **Integration Point**: Procurement system
- **Trigger**: Weekly inventory review
- **Output**: Demand prediction for item combinations

#### 3. Customer Journey Optimization
- **Integration Point**: Marketing automation
- **Trigger**: Customer browsing behavior
- **Output**: Personalized email recommendations

### ROI Calculation
```python
# Business impact estimation
def calculate_roi_metrics(baseline_conversion, lift_percentage, avg_order_value):
    """
    Calculate expected ROI from recommendation system deployment
    """
    improved_conversion = baseline_conversion * (1 + lift_percentage)
    revenue_lift = (improved_conversion - baseline_conversion) * avg_order_value
    return revenue_lift
```

## 📊 Advanced Analytics

### Model Interpretability
The notebook includes detailed analysis of:
- **Feature Importance**: Context contribution weights
- **Prediction Confidence**: Calibrated confidence scores
- **Item Coverage**: Long-tail recommendation analysis
- **Temporal Stability**: Performance consistency over time

### A/B Testing Framework
```python
# Built-in A/B testing utilities
def ab_test_setup(control_config, test_config, traffic_split=0.5):
    """
    Configure A/B test between different model configurations
    """
    pass
```

## 🔄 Model Updates & Maintenance

### Recommended Update Frequency
- **High-volume stores**: Weekly model refresh
- **Medium-volume stores**: Bi-weekly refresh
- **Low-volume stores**: Monthly refresh

### Performance Monitoring
```python
# Key monitoring metrics
def monitor_model_health():
    metrics = {
        'recommendation_coverage': calculate_coverage(),
        'avg_confidence_score': calculate_avg_confidence(),
        'diversity_score': calculate_diversity(),
        'temporal_consistency': check_temporal_stability()
    }
    return metrics
```

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch from `main`
3. Test changes in Colab environment
4. Submit pull request with performance benchmarks
5. Include updated documentation

### Code Standards
- **Documentation**: Comprehensive docstrings for all functions
- **Testing**: Unit tests for core algorithm components
- **Performance**: Benchmark results for significant changes
- **Reproducibility**: Fixed random seeds for consistent results



## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <strong>🚀 Ready to revolutionize your recommendation system?</strong><br>
  <a href="https://colab.research.google.com/github/ydnaincy/wingmate-ai/blob/main/CodeBloom_CodeBase.ipynb">
    <img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab"/>
  </a>
</div>

<div align="center">
  <br>
  <strong>Built with ❤️ by the CodeBloom Team</strong><br>
  <em>Last Updated: August 2025</em>
</div>
