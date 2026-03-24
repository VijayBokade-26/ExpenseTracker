
import MainLayout from "../../../layout/MainLayout";
import ExpenseView from "../components/ExpenseView";

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
