#!/usr/bin/env python3
"""
Real Estate Price Estimation using Linear Regression
This script performs linear regression analysis on historical price data
to predict future property values.
"""

import sys
import json
import numpy as np
from sklearn.linear_model import LinearRegression
import warnings
warnings.filterwarnings('ignore')

def calculate_price_estimation(current_price, property_size):
    """
    Calculate price estimation using linear regression based on historical data
    
    Args:
        current_price: Current total property price
        property_size: Property size in square meters
    
    Returns:
        Dictionary containing estimation results
    """
    
    # Historical price data for Tarlac City (BIR rates per sqm)
    historical_data = {
        2021: 52,
        2022: 61,
        2023: 73,
        2024: 85,
        2025: 100
    }
    
    # Prepare data for linear regression
    years = np.array(list(historical_data.keys())).reshape(-1, 1)
    prices_per_sqm = np.array(list(historical_data.values()))
    
    # Normalize years for better regression (start from 0)
    years_normalized = years - years.min()
    
    # Create and train the linear regression model
    model = LinearRegression()
    model.fit(years_normalized, prices_per_sqm)
    
    # Predict 2026 price per sqm
    year_2026_normalized = np.array([[2026 - years.min()]])
    predicted_2026_price_per_sqm = model.predict(year_2026_normalized)[0]
    
    # Calculate metrics
    current_price_per_sqm = current_price / property_size
    estimated_total_price = predicted_2026_price_per_sqm * property_size
    profit_projection = estimated_total_price - current_price
    percentage_growth = ((estimated_total_price - current_price) / current_price) * 100
    
    # Calculate R-squared score for model accuracy
    r_squared = model.score(years_normalized, prices_per_sqm)
    
    # Get regression coefficients
    slope = model.coef_[0]
    intercept = model.intercept_
    
    # Prepare historical data with predictions for chart
    chart_data = []
    for year in range(2021, 2027):
        year_norm = np.array([[year - 2021]])
        if year <= 2025:
            # Use actual historical data
            price = historical_data.get(year, 0)
        else:
            # Use predicted data
            price = model.predict(year_norm)[0]
        
        chart_data.append({
            'year': year,
            'price_per_sqm': round(price, 2)
        })
    
    # Prepare response
    result = {
        'success': True,
        'estimation': {
            'current_price': round(current_price, 2),
            'property_size': property_size,
            'current_price_per_sqm': round(current_price_per_sqm, 2),
            'estimated_price': round(estimated_total_price, 2),
            'profit_projection': round(profit_projection, 2),
            'predicted_2026_price_per_sqm': round(predicted_2026_price_per_sqm, 2),
            'percentage_growth': round(percentage_growth, 2),
            'confidence_score': round(r_squared * 100, 2)  # Convert to percentage
        },
        'regression': {
            'slope': round(slope, 4),
            'intercept': round(intercept, 4),
            'r_squared': round(r_squared, 4),
            'equation': f"y = {round(slope, 2)}x + {round(intercept, 2)}"
        },
        'historical_data': historical_data,
        'chart_data': chart_data
    }
    
    return result

def main():
    """
    Main function to handle command line arguments and execute estimation
    """
    try:
        # Check if we have the correct number of arguments
        if len(sys.argv) != 3:
            raise ValueError("Invalid number of arguments")
        
        # Parse arguments
        current_price = float(sys.argv[1])
        property_size = float(sys.argv[2])
        
        # Validate inputs
        if current_price <= 0 or property_size <= 0:
            raise ValueError("Price and size must be positive numbers")
        
        # Calculate estimation
        result = calculate_price_estimation(current_price, property_size)
        
        # Output as JSON
        print(json.dumps(result))
        
    except ValueError as e:
        error_result = {
            'success': False,
            'error': str(e),
            'message': 'Invalid input values provided'
        }
        print(json.dumps(error_result))
        sys.exit(1)
        
    except Exception as e:
        error_result = {
            'success': False,
            'error': str(e),
            'message': 'An error occurred during calculation'
        }
        print(json.dumps(error_result))
        sys.exit(1)

if __name__ == "__main__":
    main()