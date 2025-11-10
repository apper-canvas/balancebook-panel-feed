import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";
import React from "react";

export const transactionService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('transaction_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        orderBy: [{
          "fieldName": "date_c",
          "sorttype": "DESC"
        }]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      // Map database fields to UI expected format
      return response.data.map(transaction => ({
        Id: transaction.Id,
        amount: transaction.amount_c || 0,
        category: transaction.category_c,
        date: transaction.date_c,
        description: transaction.description_c || transaction.Name,
        notes: transaction.notes_c,
        type: transaction.type_c,
        createdAt: transaction.CreatedOn
      }));
    } catch (error) {
      console.error("Error fetching transactions:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById('transaction_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (!response.data) {
        return null;
      }

      const transaction = response.data;
      return {
        Id: transaction.Id,
        amount: transaction.amount_c || 0,
        category: transaction.category_c,
        date: transaction.date_c,
        description: transaction.description_c || transaction.Name,
        notes: transaction.notes_c,
        type: transaction.type_c,
        createdAt: transaction.CreatedOn
      };
    } catch (error) {
      console.error(`Error fetching transaction ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async getByMonth(month) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('transaction_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        where: [{
          "FieldName": "date_c",
          "Operator": "StartsWith",
          "Values": [month]
        }],
        orderBy: [{
          "fieldName": "date_c",
          "sorttype": "DESC"
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(transaction => ({
        Id: transaction.Id,
        amount: transaction.amount_c || 0,
        category: transaction.category_c,
        date: transaction.date_c,
        description: transaction.description_c || transaction.Name,
        notes: transaction.notes_c,
        type: transaction.type_c,
        createdAt: transaction.CreatedOn
      }));
    } catch (error) {
      console.error("Error fetching transactions by month:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getByCategory(category) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('transaction_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        where: [{
          "FieldName": "category_c",
          "Operator": "EqualTo",
          "Values": [category]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(transaction => ({
        Id: transaction.Id,
        amount: transaction.amount_c || 0,
        category: transaction.category_c,
        date: transaction.date_c,
        description: transaction.description_c || transaction.Name,
        notes: transaction.notes_c,
        type: transaction.type_c,
        createdAt: transaction.CreatedOn
      }));
    } catch (error) {
      console.error("Error fetching transactions by category:", error?.response?.data?.message || error);
      return [];
    }
  },

  async create(transactionData) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        records: [{
          Name: transactionData.description,
          amount_c: transactionData.amount,
          category_c: transactionData.category,
          date_c: transactionData.date,
          description_c: transactionData.description,
          notes_c: transactionData.notes || "",
          type_c: transactionData.type
        }]
      };

      const response = await apperClient.createRecord('transaction_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} transactions:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const createdTransaction = successful[0].data;
          return {
            Id: createdTransaction.Id,
            amount: createdTransaction.amount_c || 0,
            category: createdTransaction.category_c,
            date: createdTransaction.date_c,
            description: createdTransaction.description_c || createdTransaction.Name,
            notes: createdTransaction.notes_c,
            type: createdTransaction.type_c,
            createdAt: createdTransaction.CreatedOn
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating transaction:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, transactionData) {
    try {
      const apperClient = getApperClient();
      
      const updateData = {
        Id: parseInt(id)
      };
      
      if (transactionData.description !== undefined) {
        updateData.Name = transactionData.description;
        updateData.description_c = transactionData.description;
      }
      if (transactionData.amount !== undefined) updateData.amount_c = transactionData.amount;
      if (transactionData.category !== undefined) updateData.category_c = transactionData.category;
      if (transactionData.date !== undefined) updateData.date_c = transactionData.date;
      if (transactionData.notes !== undefined) updateData.notes_c = transactionData.notes;
      if (transactionData.type !== undefined) updateData.type_c = transactionData.type;

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('transaction_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} transactions:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const updatedTransaction = successful[0].data;
          return {
            Id: updatedTransaction.Id,
            amount: updatedTransaction.amount_c || 0,
            category: updatedTransaction.category_c,
            date: updatedTransaction.date_c,
            description: updatedTransaction.description_c || updatedTransaction.Name,
            notes: updatedTransaction.notes_c,
            type: updatedTransaction.type_c,
            createdAt: updatedTransaction.CreatedOn
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating transaction:", error?.response?.data?.message || error);
      return null;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      
      const params = { 
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('transaction_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} transactions:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting transaction:", error?.response?.data?.message || error);
      return false;
    }
  },

  async getIncomeExpenseTrend(months) {
    try {
      const trendData = [];
      
      for (const month of months) {
        const monthTransactions = await this.getByMonth(month);
        
        const income = monthTransactions
          .filter(t => t.type === "income")
          .reduce((sum, t) => sum + (t.amount || 0), 0);
        
        const expenses = monthTransactions
          .filter(t => t.type === "expense")
          .reduce((sum, t) => sum + (t.amount || 0), 0);
        
        trendData.push({
          month,
          income,
          expenses,
          net: income - expenses
        });
      }
      
      return trendData;
    } catch (error) {
      console.error("Error getting income expense trend:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getCategoryBreakdown(month) {
    try {
      const monthTransactions = await this.getByMonth(month);
      const expenseTransactions = monthTransactions.filter(t => t.type === "expense");
      
      if (expenseTransactions.length === 0) {
        return [];
      }
      
      const categoryTotals = expenseTransactions.reduce((acc, transaction) => {
        acc[transaction.category] = (acc[transaction.category] || 0) + (transaction.amount || 0);
        return acc;
      }, {});

      return Object.entries(categoryTotals).map(([category, amount]) => ({
        category,
        amount
      }));
} catch (error) {
      console.error("Error getting category breakdown:", error?.response?.data?.message || error);
      return [];
    }
  }
};