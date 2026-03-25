import { use, useEffect, useRef, useState } from "react";

import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Sheet, Trash2, Trash2Icon } from "lucide-react";
import {
  createExpense,
  deleteExpense,
  fetchExpenses,
  updateExpense,
} from "../../../services/methods";
import { exportToExcel } from "../../../helper/helpers";
import { expenseCategories } from "../../../common/constants";
import Tooltip from "../../../common/components/Tooltip";

//category + its icon

const ExpenseView = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [selectedRecords, setSelectedRecords] = useState([]);
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
    selectedRecords.length > 0 && setSelectedRecords([]);
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

  //delete single /multiple expenses by ids (not implemented in this snippet)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleDeleteExpenses = async (ids) => {
    try {
      const response = await deleteExpense(ids);
      toast.success(response.message || "Expense(s) deleted successfully!");
      setSelectedRecords([]);
      getExpenses(); // Refresh the expense list after deletion
    } catch (error) {
      console.error("Error deleting expenses:", error);
      toast.error("Failed to delete expense(s). Please try again.");
    }
  };

  const OnClickDelete = (ids) => {
    const finalIds = Array.isArray(ids) ? ids : [ids];

    if (finalIds.length === 0) return;
    toast.dismiss();
    const message =
      finalIds.length > 1
        ? `Delete ${finalIds.length} expenses?`
        : `Delete this expense? (#${finalIds[0]})`;

    toast.info(
      ({ closeToast }) => (
        <div>
          <p>{message}</p>

          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button
              className="common-button-danger"
              onClick={() => {
                handleDeleteExpenses(finalIds);
                closeToast();
              }}
            >
              Yes, Delete
            </button>

            <button className="common-button-secondary" onClick={closeToast}>
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      },
    );
  };

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
                {Object.keys(expenseCategories).map((key) => (
                  <option key={key} value={key}>
                    {expenseCategories[key]}{" "}
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </option>
                ))}
              </select>
              {formik.errors.category && formik.touched.category && (
                <div className="error-message">{formik.errors.category}</div>
              )}

              <br />

              <input
                type="number"
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
                  className="common-button-primary "
                >
                  {selectedExpense ? "Update Expense" : "Add Expense"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setSelectedExpense(null);
                  }}
                  className=" common-button-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
        <div
          className={`common-gap ${showAddForm ? "" : "common-container "}`}
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          {!showAddForm && (
            <button
              onClick={handleAddExpense}
              className="common-button-primary "
            >
              Add Expense
            </button>
          )}

          {selectedRecords.length > 0 && !showAddForm && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "10px",
              }}
            >
              <button
                onClick={() => {
                  //remove user_id,created_at, updated_at from selectedRecords before exporting
                  const recordsToExport = selectedRecords.map(
                    ({ user_id, created_at, updated_at, ...rest }) => rest,
                  );
                  exportToExcel(recordsToExport, "Expenses");
                }}
                className=" common-button animation-fadeInOut"
              >
                <Sheet size={16} /> Export
              </button>
              <button
                onClick={() => {
                  OnClickDelete(selectedRecords.map((record) => record.id));
                }}
                className=" common-button-danger animation-fadeInOut "
              >
                <Trash2 size={16} /> Delete Selected ({selectedRecords.length})
              </button>
            </div>
          )}
        </div>
      </div>
      <table className="common-table">
        <thead>
          <tr>
            <th style={{ width: "5px" }}>
              <input
                type="checkbox"
                className="common-checkbox"
                checked={
                  expenses.data?.length > 0 &&
                  selectedRecords.length === expenses.data.length
                }
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedRecords(expenses.data || []);
                  } else {
                    setSelectedRecords([]);
                  }
                }}
              />
            </th>
            <th style={{ width: "5px" }}>#ID</th>
            <th>Title</th>
            <th title="Category" style={{ width: "2px" }}>
              CT
            </th>
            <th style={{ width: "10px" }}>Amount</th>
            <th style={{ width: "10px" }}>Date</th>
            <th style={{ width: "5px" }} title="Action">
              AC
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <td colSpan="7" className="nodatafound">
              Loading...
            </td>
          ) : expenses.data.length > 0 ? (
            expenses.data.map((expense) => (
              <tr
                key={expense.id}
                onClick={() => {
                  setSelectedExpense(expense);
                  selectedRecords.length > 0 && setSelectedRecords([]);
                  setShowAddForm(true);
                }}
                
              >
                <td
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <input
                    type="checkbox"
                    title={
                      selectedRecords.some((item) => item.id === expense.id)
                        ? "Deselect Record"
                        : "Select Record"
                    }
                    className="common-checkbox"
                    checked={selectedRecords.some(
                      (item) => item.id === expense.id,
                    )}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedRecords([...selectedRecords, expense]);
                      } else {
                        setSelectedRecords(
                          selectedRecords.filter(
                            (item) => item.id !== expense.id,
                          ),
                        );
                      }
                    }}
                  />
                </td>
                <td>#{expense.id}</td>
                <td>{expense.title}</td>
                <td>
                  <span
                    style={{
                      backgroundColor: "#253046ff",
                      padding: "5px",
                      borderRadius: "4px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <Tooltip
                      position="top"
                      text={
                        expense.category.charAt(0).toUpperCase() +
                        expense.category.slice(1)
                      }
                    >
                      {expenseCategories[expense.category]}
                    </Tooltip>
                  </span>
                </td>
                <td>${expense.amount}</td>
                <td>{new Date(expense.date).toLocaleDateString()}</td>
                <td
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle delete action here (not implemented in this snippet)
                    OnClickDelete(expense.id);
                  }}
                >
                  <Tooltip
                    position="left"
                    text={`Remove Expense ${expense.id}`}
                  >
                    <Trash2Icon size={16} color="red" />
                  </Tooltip>
                </td>
              </tr>
            ))
          ) : (
            <td colSpan="7" className="nodatafound">
              No expenses found.
            </td>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseView;
