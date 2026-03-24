import { useCallback } from "react";
import MainLayout from "../../../layout/MainLayout";
import ExpenseView from "../components/ExpenseView";
import { useNavigate } from "react-router-dom";

const ExpenseModule = () => {
  return (
    <MainLayout>
      <div>
        <h1>Expenses</h1>
        <ExpenseView />
      </div>
    </MainLayout>
  );
};

export default ExpenseModule;
