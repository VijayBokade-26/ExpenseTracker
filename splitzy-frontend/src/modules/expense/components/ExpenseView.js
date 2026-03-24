import { useEffect, useRef, useState } from "react";

import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import {
  Car,
  Film,
  Lightbulb,
  MoreHorizontal,
  PlusCircle,
  ShoppingBag,
  Utensils,
} from "lucide-react";
import {
  createExpense,
  fetchExpenses,
  updateExpense,
} from "../../../services/methods";

//category + its icon
const categories = {
  food: <Utensils size={16} />, //  Food
  entertainment: <Film size={16} />, //  Movies/Fun
  utilities: <Lightbulb size={16} />, //  Bills/Electricity
  travel: <Car size={16} />, //  Travel
  shopping: <ShoppingBag size={16} />, //  Shopping
  other: <MoreHorizontal size={16} />, //  Others
};
const ExpenseView = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const dateRef = useRef();

  //fetch expenses from API and setExpenses
  const getExpenses = async () => {
    try {
      setLoading(true);
      const data = await fetchExpenses();

      setExpenses(data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getExpenses();
  }, []);

  const handleAddExpense = () => {
    formik.resetForm();
    setShowAddForm(true);
  };
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: selectedExpense ? selectedExpense.title : "",
      category: selectedExpense ? selectedExpense.category : "",
      amount: selectedExpense ? selectedExpense.amount.toString() : "",
      date: selectedExpense ? selectedExpense.date : "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      category: Yup.string().required("Category is required"),
      amount: Yup.number()
        .typeError("Amount must be a number")
        .positive("Amount must be positive")
        .required("Amount is required"),
      date: Yup.date().required("Date is required"),
    }),
    onSubmit: async (values, { resetForm, isSubmitting }) => {
      // Handle form submission, e.g., send data to API
      try {
        const payload = {
          title: values.title,
          category: values.category,
          amount: parseFloat(values.amount),
          date: values.date,
        };
        if (selectedExpense) {
          payload.id = selectedExpense.id; // Include ID for editing existing expense
          await updateExpense(payload); // Call update API (not implemented in this snippet)
        } else {
          await createExpense(payload);
        }
        toast.success(
          `Expense ${selectedExpense ? "updated" : "added"} successfully!`,
        );
        resetForm();
        setShowAddForm(false);
        getExpenses(); // Refresh the expense list after adding a new expense
      } catch (error) {
        console.error("Error submitting expense:", error);

        const message =
          error?.response?.data?.detail?.[0]?.msg ||
          error?.response?.data?.message ||
          "Failed to submit expense";

        toast.error(message);
      }
    },
  });

  return (
    <div>
      <div>
        {showAddForm && (
          <div className="common-container ">
            {/* Add Expense Form - can be a separate component */}
            <h3>{selectedExpense ? "Update " : "Add New "} Expense</h3>
            <form onSubmit={formik.handleSubmit}>
              <input
                type="text"
                className="common-input"
                placeholder="Title"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
              />
              {formik.errors.title && formik.touched.title && (
                <div className="error-message">{formik.errors.title}</div>
              )}

              <br />
              <select
                className="common-select"
                name="category"
                value={formik.values.category}
                onChange={formik.handleChange}
              >
                <option value="">Select Category</option>
                {Object.keys(categories).map((key) => (
                  <option key={key} value={key}>
                    {categories[key]}{" "}
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </option>
                ))}
              </select>
              {formik.errors.category && formik.touched.category && (
                <div className="error-message">{formik.errors.category}</div>
              )}

              <br />

              <input
                type="text"
                className="common-input"
                placeholder="Amount"
                name="amount"
                value={formik.values.amount}
                onChange={formik.handleChange}
              />
              {formik.errors.amount && formik.touched.amount && (
                <div className="error-message">{formik.errors.amount}</div>
              )}

              <br />

              <input
                type="date"
                className="common-input"
                name="date"
                value={formik.values.date}
                ref={dateRef}
                onChange={formik.handleChange}
                onClick={() => dateRef.current.showPicker()}
              />
              {formik.errors.date && formik.touched.date && (
                <div className="error-message">{formik.errors.date}</div>
              )}

              <br />
              <div className="common-gap">
                <button
                  type="submit"
                  disabled={formik.isSubmitting}
                  className="common-button"
                >
                  {selectedExpense ? "Update Expense" : "Add Expense"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setSelectedExpense(null);
                  }}
                  className="common-button common-button-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
        {!showAddForm && (
          <button onClick={handleAddExpense} className="common-button">
            <PlusCircle size={16} /> Add Expense
          </button>
        )}
      </div>
      <table className="common-table">
        <thead>
          <tr>
            <th>#ID</th>
            <th>Title</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <td colSpan="5" className="nodatafound">
              Loading...
            </td>
          ) : expenses.data.length > 0 ? (
            expenses.data.map((expense) => (
              <tr
                key={expense.id}
                onClick={() => {
                  setSelectedExpense(expense);
                  setShowAddForm(true);
                }}
                title={`Click To Edit ID ${expense.id}`}
              >
                <td>#{expense.id}</td>
                <td>{expense.title}</td>
                <td
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                  {categories[expense.category]}
                  {expense.category.charAt(0).toUpperCase() +
                    expense.category.slice(1)}
                </td>
                <td>${expense.amount}</td>
                <td>{new Date(expense.date).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <td colSpan="5" className="nodatafound">
              No expenses found.
            </td>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseView;
