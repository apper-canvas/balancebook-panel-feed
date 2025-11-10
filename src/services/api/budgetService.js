import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

export const budgetService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('budget_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "month_c"}},
          {"field": {"Name": "monthly_limit_c"}},
          {"field": {"Name": "spent_c"}},
          {"field": {"Name": "rollover_c"}}
        ]
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
      return response.data.map(budget => ({
        Id: budget.Id,
        category: budget.category_c,
        month: budget.month_c,
        monthlyLimit: budget.monthly_limit_c || 0,
        spent: budget.spent_c || 0,
        rollover: budget.rollover_c || 0
      }));
    } catch (error) {
      console.error("Error fetching budgets:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById('budget_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "month_c"}},
          {"field": {"Name": "monthly_limit_c"}},
          {"field": {"Name": "spent_c"}},
          {"field": {"Name": "rollover_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (!response.data) {
        return null;
      }

      const budget = response.data;
      return {
        Id: budget.Id,
        category: budget.category_c,
        month: budget.month_c,
        monthlyLimit: budget.monthly_limit_c || 0,
        spent: budget.spent_c || 0,
        rollover: budget.rollover_c || 0
      };
    } catch (error) {
      console.error(`Error fetching budget ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async getByMonth(month) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('budget_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "month_c"}},
          {"field": {"Name": "monthly_limit_c"}},
          {"field": {"Name": "spent_c"}},
          {"field": {"Name": "rollover_c"}}
        ],
        where: [{
          "FieldName": "month_c",
          "Operator": "EqualTo",
          "Values": [month]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(budget => ({
        Id: budget.Id,
        category: budget.category_c,
        month: budget.month_c,
        monthlyLimit: budget.monthly_limit_c || 0,
        spent: budget.spent_c || 0,
        rollover: budget.rollover_c || 0
      }));
    } catch (error) {
      console.error("Error fetching budgets by month:", error?.response?.data?.message || error);
      return [];
    }
  },

  async create(budgetData) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        records: [{
          Name: budgetData.category,
          category_c: budgetData.category,
          month_c: budgetData.month,
          monthly_limit_c: budgetData.monthlyLimit,
          spent_c: 0,
          rollover_c: 0
        }]
      };

      const response = await apperClient.createRecord('budget_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} budgets:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const createdBudget = successful[0].data;
          return {
            Id: createdBudget.Id,
            category: createdBudget.category_c,
            month: createdBudget.month_c,
            monthlyLimit: createdBudget.monthly_limit_c || 0,
            spent: createdBudget.spent_c || 0,
            rollover: createdBudget.rollover_c || 0
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating budget:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, budgetData) {
    try {
      const apperClient = getApperClient();
      
      const updateData = {
        Id: parseInt(id)
      };
      
      if (budgetData.category !== undefined) {
        updateData.Name = budgetData.category;
        updateData.category_c = budgetData.category;
      }
      if (budgetData.month !== undefined) updateData.month_c = budgetData.month;
      if (budgetData.monthlyLimit !== undefined) updateData.monthly_limit_c = budgetData.monthlyLimit;
      if (budgetData.spent !== undefined) updateData.spent_c = budgetData.spent;
      if (budgetData.rollover !== undefined) updateData.rollover_c = budgetData.rollover;

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('budget_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} budgets:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const updatedBudget = successful[0].data;
          return {
            Id: updatedBudget.Id,
            category: updatedBudget.category_c,
            month: updatedBudget.month_c,
            monthlyLimit: updatedBudget.monthly_limit_c || 0,
            spent: updatedBudget.spent_c || 0,
            rollover: updatedBudget.rollover_c || 0
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating budget:", error?.response?.data?.message || error);
      return null;
    }
  },

  async updateSpent(category, month, amount) {
    try {
      // Find budget by category and month
      const budgets = await this.getByMonth(month);
      const budget = budgets.find(b => b.category === category);
      
      if (budget) {
        return await this.update(budget.Id, { spent: amount });
      }
      
      return null;
    } catch (error) {
      console.error("Error updating spent amount:", error?.response?.data?.message || error);
      return null;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      
      const params = { 
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('budget_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} budgets:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting budget:", error?.response?.data?.message || error);
      return false;
    }
  },

  async getBudgetSummary(month) {
    try {
      const monthBudgets = await this.getByMonth(month);
      
      if (monthBudgets.length === 0) {
        return {
          totalBudget: 0,
          totalSpent: 0,
          remaining: 0,
          percentage: 0,
          categories: 0
        };
      }
      
      const totalBudget = monthBudgets.reduce((sum, b) => sum + (b.monthlyLimit || 0), 0);
      const totalSpent = monthBudgets.reduce((sum, b) => sum + (b.spent || 0), 0);
      const remaining = totalBudget - totalSpent;
      const percentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

      return {
        totalBudget,
        totalSpent,
        remaining,
        percentage,
        categories: monthBudgets.length
      };
    } catch (error) {
      console.error("Error getting budget summary:", error?.response?.data?.message || error);
      return {
        totalBudget: 0,
        totalSpent: 0,
        remaining: 0,
        percentage: 0,
        categories: 0
      };
    }
  }
};