import { useEffect, useState } from "react";
import CategoryChart from "../Components/CategoryChart";
import TimeChart from "../Components/TimeChart";

import {
  fetchExpenses,
  createExpense,
  deleteExpense,
  fetchSummary,
} from "../services/api";

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({ total: 0, per_category: {} });

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("Food");

  async function loadData() {
    const params = {};
    if (start) params.start_date = start;
    if (end) params.end_date = end;
    if (categoryFilter) params.category = categoryFilter;

    const [exp, sum] = await Promise.all([
      fetchExpenses(params),
      fetchSummary(),
    ]);
    setExpenses(exp);
    setSummary(sum);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleFilterSubmit(e) {
    e.preventDefault();
    await loadData();
  }

  function handleResetFilters(e) {
    e.preventDefault();
    setStart("");
    setEnd("");
    setCategoryFilter("");
    loadData();
  }

  async function handleAddExpense(e) {
    e.preventDefault();
    if (!description || !amount || !date) return;

    await createExpense({
      title: description,
      amount: parseFloat(amount),
      date,
      category,
    });

    setDescription("");
    setAmount("");
    setDate("");
    setCategory("Food");

    await loadData();
  }

  async function handleDelete(id) {
    await deleteExpense(id);
    await loadData();
  }

  // SAFE total calculation
  const totalAmount =
    summary && typeof summary.total === "number" ? summary.total : 0;
  const totalText = `₹${totalAmount.toFixed(2)}`;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className=" text-5xl font-semibold text-black font-bold font-italic mb-2">SmartSpend</h1>
      <p className="text-black mb-6">
        Track spending, filter by date/category, and visualize instantly.
      </p>

      {/* Top row: filters + add + charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        {/* Left: Filters + total + add */}
        <section className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <h2 className="text-lg font-semibold mb-3">Filters</h2>
          <form
            className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end pr-5"
            onSubmit={handleFilterSubmit}
          >
            <label className="text-sm">
              <span className="block mb-1 text-slate-300">Start</span>
              <input
                type="date"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-slate-100"
              />
            </label>
            <label className="text-sm">
              <span className="block mb-1 text-slate-300">End</span>
              <input
                type="date"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-slate-100"
              />
            </label>
            <label className="text-sm md:col-span-2">
              <span className="block mb-1 text-slate-300">Category</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-slate-100"
              >
                <option value="">All</option>
                <option>Food</option>
                <option>Transport</option>
                <option>Utilities</option>
                <option>Rent</option>
              </select>
            </label>
            <div className="flex gap-2">
              <button
                className="rounded-xl bg-brand/20 hover:bg-brand/30 text-brand px-4 py-2 border border-brand/30"
                type="submit"
              >
                Apply
              </button>
              <button
                className="rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2 border border-slate-700 text-sm"
                onClick={handleResetFilters}
              >
                Reset
              </button>
            </div>
          </form>

          {/* Total inside filters card */}
          <div className="mt-4 text-sm text-slate-300">
            <span className="mr-2 text-black">Total:</span>
            <span className="inline-block rounded-xl border border-slate-700 bg-slate-800 px-3 py-1 font-semibold">
              {totalText}
            </span>
          </div>

          {/* Add Expense */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-3">Add Expense</h2>
            <form className="space-y-3" onSubmit={handleAddExpense}>
              <label className="block text-sm">
                <span className="mb-1 block text-slate-300">Description</span>
                <input
                  placeholder="e.g., Groceries"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-slate-100"
                />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block text-sm">
                  <span className="mb-1 block text-slate-300">Amount</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="25.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-slate-100"
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block text-slate-300">Date</span>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-slate-100"
                  />
                </label>
              </div>
              <label className="block text-sm">
                <span className="mb-1 block text-slate-300">Category</span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-slate-100"
                >
                  <option>Food</option>
                  <option>Transport</option>
                  <option>Rent</option>
                  <option>Utilities</option>
                </select>
              </label>
              <button
                className="w-full rounded-xl bg-brand/20 hover:bg-brand/30 text-brand px-4 py-2 border border-brand/30"
                type="submit"
              >
                Add Expense
              </button>
            </form>
          </div>
        </section>

        {/* Right: charts stacked */}
        <div className="space-y-4">
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <h3 className="font-semibold mb-2">By Category</h3>
            <CategoryChart data={summary.per_category} />
          </section>
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <h3 className="font-semibold mb-2">Spending Over Time</h3>
            <TimeChart expenses={expenses} />
          </section>
        </div>
      </div>

      {/* Global total below if you still want it */}
      <div className="mb-3 mt-6">
        <span className="text-xl font-bold text-black mr-2">Total:</span>
        <span className="inline-block rounded-xl border border-slate-700 bg-slate-800 px-3 py-1 font-semibold">
          {totalText}
        </span>
      </div>

      {/* Expenses table */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900">
        <div className="px-4 py-3 border-b border-slate-800">
          <h2 className="text-lg font-semibold">Expenses</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-slate-300 bg-slate-800/50">
              <tr>
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-left px-4 py-3">Description</th>
                <th className="text-left px-4 py-3">Category</th>
                <th className="text-right px-4 py-3">Amount</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {expenses.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-4 py-6 text-center text-slate-400"
                  >
                    No expenses yet — add your first one above.
                  </td>
                </tr>
              ) : (
                expenses.map((e) => (
                  <tr
                    key={e.id}
                    className="border-t border-slate-800 hover:bg-slate-800/30"
                  >
                    <td className="px-4 py-2">{e.date}</td>
                    <td className="px-4 py-2">{e.title}</td>
                    <td className="px-4 py-2">{e.category}</td>
                    <td className="px-4 py-2 text-right">
                      ₹{e.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <button
                        className="text-rose-300 hover:text-rose-200 text-xs border border-rose-400/30 px-3 py-1 rounded-lg"
                        onClick={() => handleDelete(e.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export default Dashboard;
