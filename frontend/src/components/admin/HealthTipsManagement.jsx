import React, { useEffect, useState } from "react";
import "./HealthTipsManagement.css";
// ✅ use a RELATIVE path unless your project has an '@' alias configured
import { healthTipsService } from "@/services/healthTipsService";

export default function HealthTipsManagement() {
    const [data, setData] = useState({ content: [], totalElements: 0, totalPages: 0, number: 0 });
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [sortBy, setSortBy] = useState("tipId");
    const [dir, setDir] = useState("desc");

    const emptyForm = { tipId: null, condition: "", ageMin: 0, ageMax: 120, gender: "All", message: "" };
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, size, sortBy, dir]);

    async function fetchList() {
        setLoading(true);
        try {
            const json = await healthTipsService.list(page, size, sortBy, dir);
            setData(json);
        } catch (e) {
            console.error(e);
            alert("Failed to load health tips.");
        } finally {
            setLoading(false);
        }
    }

    function onChange(e) {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: name === "ageMin" || name === "ageMax" ? Number(value) : value }));
    }

    async function onSubmit(e) {
        e.preventDefault();
        try {
            if (editingId) {
                await healthTipsService.update(editingId, form);
            } else {
                await healthTipsService.create(form);
            }
            setForm(emptyForm);
            setEditingId(null);
            fetchList();
        } catch (e) {
            console.error(e);
            alert("Failed to save tip.");
        }
    }

    function onEdit(tip) {
        setEditingId(tip.tipId);
        setForm({
            tipId: tip.tipId,
            condition: tip.condition,
            ageMin: tip.ageMin,
            ageMax: tip.ageMax,
            gender: tip.gender,
            message: tip.message,
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function onDelete(id) {
        if (!window.confirm("Delete this tip?")) return;
        try {
            await healthTipsService.remove(id);
            fetchList();
        } catch (e) {
            console.error(e);
            alert("Failed to delete tip.");
        }
    }

    return (
        <div className="ht-admin">
            <h2>Manage Health Tips</h2>

            <form className="ht-form" onSubmit={onSubmit}>
                <div className="row">
                    <label>Condition</label>
                    <input
                        name="condition"
                        value={form.condition}
                        onChange={onChange}
                        placeholder="e.g., Diabetes, Heart, General, None"
                        required
                    />
                </div>

                <div className="row two">
                    <div>
                        <label>Age Min</label>
                        <input type="number" name="ageMin" value={form.ageMin} onChange={onChange} min={0} max={150} required />
                    </div>
                    <div>
                        <label>Age Max</label>
                        <input type="number" name="ageMax" value={form.ageMax} onChange={onChange} min={0} max={150} required />
                    </div>
                </div>

                <div className="row">
                    <label>Gender</label>
                    <select name="gender" value={form.gender} onChange={onChange} required>
                        <option>All</option>
                        <option>Male</option>
                        <option>Female</option>
                    </select>
                </div>

                <div className="row">
                    <label>Message</label>
                    <textarea name="message" value={form.message} onChange={onChange} rows={3} required />
                </div>

                <div className="actions">
                    <button type="submit">{editingId ? "Update" : "Add"} Tip</button>
                    {editingId && (
                        <button
                            type="button"
                            className="ghost"
                            onClick={() => {
                                setEditingId(null);
                                setForm(emptyForm);
                            }}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            <div className="ht-toolbar">
                <div className="left">
                    <label>Page Size</label>
                    <select value={size} onChange={(e) => { setPage(0); setSize(Number(e.target.value)); }}>
                        {[5, 10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>

                    <label>Sort</label>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="tipId">ID</option>
                        <option value="condition">Condition</option>
                        <option value="ageMin">AgeMin</option>
                        <option value="ageMax">AgeMax</option>
                        <option value="gender">Gender</option>
                    </select>

                    <select value={dir} onChange={(e) => setDir(e.target.value)}>
                        <option value="desc">Desc</option>
                        <option value="asc">Asc</option>
                    </select>
                </div>

                <div className="right">
                    {loading ? <span>Loading…</span> : <span>Total: {data.totalElements}</span>}
                </div>
            </div>

            <div className="ht-table-wrap">
                <table className="ht-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Condition</th>
                        <th>Age Range</th>
                        <th>Gender</th>
                        <th>Message</th>
                        <th style={{ width: 120 }}>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.content.map(t => (
                        <tr key={t.tipId}>
                            <td>{t.tipId}</td>
                            <td>{t.condition}</td>
                            <td>{t.ageMin}–{t.ageMax}</td>
                            <td>{t.gender}</td>
                            <td className="msg">{t.message}</td>
                            <td className="actions-col">
                                <button onClick={() => onEdit(t)}>Edit</button>
                                <button className="danger" onClick={() => onDelete(t.tipId)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                    {!loading && data.content.length === 0 && (
                        <tr><td colSpan="6" style={{ textAlign: 'center', padding: '16px' }}>No tips</td></tr>
                    )}
                    </tbody>
                </table>
            </div>

            <div className="ht-pager">
                <button disabled={page === 0} onClick={() => setPage(p => p - 1)}>Prev</button>
                <span>Page {data.number + 1} / {data.totalPages || 1}</span>
                <button disabled={page >= (data.totalPages - 1)} onClick={() => setPage(p => p + 1)}>Next</button>
            </div>
        </div>
    );
}
