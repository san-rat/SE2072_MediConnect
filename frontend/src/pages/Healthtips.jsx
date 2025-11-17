import React, { useEffect, useState } from "react";
import { healthTipsService } from "@/services/healthTipsService";
import "./Healthtips.css";

const HealthTips = () => {
    const [userData, setUserData] = useState(() => {
        const stored = localStorage.getItem("userData");
        return stored ? JSON.parse(stored) : null;
    });
    const [tips, setTips] = useState([]);
    const [formData, setFormData] = useState({ age: "", gender: "", condition: "" });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        localStorage.setItem("userData", JSON.stringify(formData));
        setUserData(formData);
    };

    useEffect(() => {
        let mounted = true;
        (async () => {
            if (!userData) return;
            setLoading(true);
            try {
                const data = await healthTipsService.getPersonalized(
                    userData.age,
                    userData.gender,
                    userData.condition
                );
                if (mounted) setTips(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Error fetching tips:", err);
                if (mounted) setTips([]);
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, [userData]);

    const clearProfile = () => {
        localStorage.removeItem("userData");
        setUserData(null);
        setTips([]);
    };

    return (
        <div className="htp-container">
            <header className="htp-header">
                <div className="htp-header-left">
                    <span className="htp-logo" aria-hidden>🩺</span>
                    <h2>Personalized Health Tips</h2>
                </div>
                <div className="htp-accent" />
            </header>

            {!userData ? (
                <form className="htp-card htp-form" onSubmit={handleSubmit}>
                    <div className="htp-form-row">
                        <label htmlFor="age">Age</label>
                        <input
                            id="age"
                            type="number"
                            name="age"
                            min="0"
                            max="150"
                            value={formData.age}
                            onChange={handleChange}
                            placeholder="e.g., 35"
                            required
                        />
                    </div>

                    <div className="htp-form-row">
                        <label htmlFor="gender">Gender</label>
                        <select id="gender" name="gender" value={formData.gender} onChange={handleChange} required>
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="All">Prefer not to say</option>
                        </select>
                    </div>

                    <div className="htp-form-row">
                        <label htmlFor="condition">Health Condition</label>
                        <input
                            id="condition"
                            type="text"
                            name="condition"
                            value={formData.condition}
                            onChange={handleChange}
                            placeholder="e.g., Diabetes, Heart, None"
                            required
                        />
                    </div>

                    <div className="htp-actions">
                        <button type="submit" className="htp-btn htp-btn-primary">Save & Get Tips</button>
                    </div>
                </form>
            ) : (
                <>
                    {/* Profile summary + Edit */}
                    <div className="htp-card htp-profile">
                        <div className="htp-pills">
                            <span className="htp-pill">Age: <strong>{userData.age}</strong></span>
                            <span className="htp-pill">Gender: <strong>{userData.gender}</strong></span>
                            <span className="htp-pill">Condition: <strong>{userData.condition || "—"}</strong></span>
                        </div>
                        <button className="htp-btn htp-btn-ghost" onClick={clearProfile}>Edit My Info</button>
                    </div>

                    {/* Tips list */}
                    <div className="htp-list">
                        {loading && (
                            <div className="htp-card htp-skeleton">
                                <div className="htp-skel-line" />
                                <div className="htp-skel-line short" />
                            </div>
                        )}

                        {!loading && tips.length === 0 && (
                            <div className="htp-card htp-empty">
                                <span>😕</span>
                                <p>No tips found for your profile.</p>
                            </div>
                        )}

                        {!loading &&
                            tips.map((tip, i) => (
                                <article key={i} className="htp-card htp-tip">
                                    <div className="htp-tip-icon" aria-hidden>💡</div>
                                    <p className="htp-tip-text">{tip.message}</p>
                                </article>
                            ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default HealthTips;
