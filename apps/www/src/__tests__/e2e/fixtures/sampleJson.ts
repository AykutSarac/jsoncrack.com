export const SAMPLE_JSON = `{
  "transactionId": "tx_9876543210_alpha",
  "timestamp": "2026-06-22T13:36:39Z",
  "version": 2.4,
  "isActive": true,
  "metadata": {
    "environment": "production",
    "serverNode": "us-east-cluster-04",
    "processingTimeMs": 142
  },
  "customer": {
    "customerId": "cust_usr_8821",
    "accountDetails": {
      "username": "johndoe_dev",
      "tier": "Platinum",
      "loyaltyPoints": 1450,
      "preferences": {
        "marketingOptIn": false,
        "theme": "dark",
        "currency": "USD"
      }
    },
    "contact": {
      "firstName": "John",
      "lastName": "Doe",
      "emails": [
        "john.doe@company.com",
        "johndoe.private@email.net"
      ],
      "phones": [
        {
          "type": "mobile",
          "number": "+1-555-019-2834",
          "primary": true
        },
        {
          "type": "work",
          "number": "+1-555-014-9988",
          "primary": false
        }
      ]
    }
  },
  "order": {
    "orderId": "ord_2026_abc123",
    "status": "Partially_Shipped",
    "financials": {
      "subtotal": 1250.00,
      "tax": 100.00,
      "shippingFees": 15.00,
      "discounts": [
        {
          "code": "SUMMER26",
          "amount": 50.00,
          "type": "percentage"
        },
        {
          "code": "LOYALTY_CREDIT",
          "amount": 25.00,
          "type": "flat_rate"
        }
      ],
      "total": 1290.00
    },
    "items": [
      {
        "itemId": "prod_4401",
        "sku": "TECH-LAP-001",
        "name": "QuantumBook Pro 15",
        "quantity": 1,
        "unitPrice": 1100.00,
        "tags": ["electronics", "computers", "workstation"],
        "dimensions": {
          "weightKg": 1.8,
          "dimensionsCm": {
            "length": 35.5,
            "width": 24.3,
            "height": 1.6
          }
        },
        "fulfillment": {
          "status": "Shipped",
          "carrier": "FedEx",
          "trackingNumber": "1Z999AA10123456784",
          "estimatedDelivery": "2026-06-25T18:00:00Z"
        }
      },
      {
        "itemId": "prod_8832",
        "sku": "ACC-MOU-092",
        "name": "Ergonomic Wireless Mouse",
        "quantity": 2,
        "unitPrice": 75.00,
        "tags": ["accessories", "peripherals"],
        "dimensions": {
          "weightKg": 0.15,
          "dimensionsCm": {
            "length": 12.0,
            "width": 7.5,
            "height": 4.2
          }
        },
        "fulfillment": {
          "status": "Pending",
          "carrier": null,
          "trackingNumber": null,
          "estimatedDelivery": null
        }
      }
    ]
  },
  "security": {
    "digitalSignature": "0x8f3c6d2e1a9b8c7d6e5f4e3d2c1b0a9f",
    "allowedRoles": [
      "admin",
      "billing_manager",
      "support_tier_2"
    ]
  }
}`;
