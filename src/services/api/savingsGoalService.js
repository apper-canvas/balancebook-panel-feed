import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

export const savingsGoalService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('savings_goal_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "target_amount_c"}},
          {"field": {"Name": "current_amount_c"}},
          {"field": {"Name": "deadline_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        orderBy: [{
          "fieldName": "priority_c",
          "sorttype": "ASC"
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
      return response.data.map(goal => ({
        Id: goal.Id,
        name: goal.name_c || goal.Name,
        targetAmount: goal.target_amount_c || 0,
        currentAmount: goal.current_amount_c || 0,
        deadline: goal.deadline_c,
        priority: goal.priority_c,
        createdAt: goal.CreatedOn
      }));
    } catch (error) {
      console.error("Error fetching savings goals:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById('savings_goal_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "target_amount_c"}},
          {"field": {"Name": "current_amount_c"}},
          {"field": {"Name": "deadline_c"}},
          {"field": {"Name": "priority_c"}},
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

      const goal = response.data;
      return {
        Id: goal.Id,
        name: goal.name_c || goal.Name,
        targetAmount: goal.target_amount_c || 0,
        currentAmount: goal.current_amount_c || 0,
        deadline: goal.deadline_c,
        priority: goal.priority_c,
        createdAt: goal.CreatedOn
      };
    } catch (error) {
      console.error(`Error fetching savings goal ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(goalData) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        records: [{
          Name: goalData.name,
          name_c: goalData.name,
          target_amount_c: goalData.targetAmount,
          current_amount_c: 0,
          deadline_c: goalData.deadline,
          priority_c: goalData.priority
        }]
      };

      const response = await apperClient.createRecord('savings_goal_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} savings goals:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const createdGoal = successful[0].data;
          return {
            Id: createdGoal.Id,
            name: createdGoal.name_c || createdGoal.Name,
            targetAmount: createdGoal.target_amount_c || 0,
            currentAmount: createdGoal.current_amount_c || 0,
            deadline: createdGoal.deadline_c,
            priority: createdGoal.priority_c,
            createdAt: createdGoal.CreatedOn
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating savings goal:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, goalData) {
    try {
      const apperClient = getApperClient();
      
      const updateData = {
        Id: parseInt(id)
      };
      
      if (goalData.name !== undefined) {
        updateData.Name = goalData.name;
        updateData.name_c = goalData.name;
      }
      if (goalData.targetAmount !== undefined) updateData.target_amount_c = goalData.targetAmount;
      if (goalData.currentAmount !== undefined) updateData.current_amount_c = goalData.currentAmount;
      if (goalData.deadline !== undefined) updateData.deadline_c = goalData.deadline;
      if (goalData.priority !== undefined) updateData.priority_c = goalData.priority;

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('savings_goal_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} savings goals:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const updatedGoal = successful[0].data;
          return {
            Id: updatedGoal.Id,
            name: updatedGoal.name_c || updatedGoal.Name,
            targetAmount: updatedGoal.target_amount_c || 0,
            currentAmount: updatedGoal.current_amount_c || 0,
            deadline: updatedGoal.deadline_c,
            priority: updatedGoal.priority_c,
            createdAt: updatedGoal.CreatedOn
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating savings goal:", error?.response?.data?.message || error);
      return null;
    }
  },

  async addContribution(id, amount) {
    try {
      // First, get current goal data
      const currentGoal = await this.getById(id);
      if (!currentGoal) {
        throw new Error("Savings goal not found");
      }

      // Update with new current amount
      const newCurrentAmount = currentGoal.currentAmount + amount;
      return await this.update(id, { currentAmount: newCurrentAmount });
    } catch (error) {
      console.error("Error adding contribution:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      
      const params = { 
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('savings_goal_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} savings goals:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting savings goal:", error?.response?.data?.message || error);
      return false;
    }
  },

  async getGoalsSummary() {
    try {
      const goals = await this.getAll();
      
      if (goals.length === 0) {
        return {
          totalTargetAmount: 0,
          totalCurrentAmount: 0,
          totalRemaining: 0,
          overallProgress: 0,
          activeGoalsCount: 0,
          completedGoalsCount: 0,
          totalGoalsCount: 0
        };
      }
      
      const totalTargetAmount = goals.reduce((sum, goal) => sum + (goal.targetAmount || 0), 0);
      const totalCurrentAmount = goals.reduce((sum, goal) => sum + (goal.currentAmount || 0), 0);
      const totalRemaining = totalTargetAmount - totalCurrentAmount;
      const overallProgress = totalTargetAmount > 0 ? (totalCurrentAmount / totalTargetAmount) * 100 : 0;
      
      const activeGoals = goals.filter(goal => goal.currentAmount < goal.targetAmount);
      const completedGoals = goals.filter(goal => goal.currentAmount >= goal.targetAmount);

      return {
        totalTargetAmount,
        totalCurrentAmount,
        totalRemaining,
        overallProgress,
        activeGoalsCount: activeGoals.length,
        completedGoalsCount: completedGoals.length,
        totalGoalsCount: goals.length
      };
    } catch (error) {
      console.error("Error getting goals summary:", error?.response?.data?.message || error);
      return {
        totalTargetAmount: 0,
        totalCurrentAmount: 0,
        totalRemaining: 0,
        overallProgress: 0,
        activeGoalsCount: 0,
        completedGoalsCount: 0,
        totalGoalsCount: 0
      };
    }
  }
};