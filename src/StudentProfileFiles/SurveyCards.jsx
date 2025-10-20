import React from 'react';

export default function SurveyCards({ survey, setSurvey }) {
    const toggleGoal = (key) => {
        setSurvey(prev => ({ ...prev, goals: { ...prev.goals, [key]: !prev.goals[key] } }));
    };

    const toggleReason = (key) => {
        setSurvey(prev => ({ ...prev, reasons: { ...prev.reasons, [key]: !prev.reasons[key] } }));
    };

    return (
        <section className="survey-cards">
            <h2 className="section-title">Student Communication Survey</h2>
            <div className="cards-grid">
                <div className="card">
                    <h3>English Proficiency Level</h3>
                    <div className="options">
                        {['Beginner','Intermediate','Advanced'].map(opt => (
                            <label key={opt} className={`pill ${survey.englishLevel===opt? 'active':''}`}>
                                <input type="radio" name="englishLevel" value={opt} checked={survey.englishLevel===opt} onChange={(e)=>setSurvey(prev=>({...prev,englishLevel:e.target.value}))} />
                                {opt}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="card">
                    <h3>Time Spent Daily</h3>
                    <div className="options">
                        {['< 30 mins','30 mins - 1 hr','> 1 hr'].map(opt => (
                            <label key={opt} className={`pill ${survey.timeSpent===opt? 'active':''}`}>
                                <input type="radio" name="timeSpent" value={opt} checked={survey.timeSpent===opt} onChange={(e)=>setSurvey(prev=>({...prev,timeSpent:e.target.value}))} />
                                {opt}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="card">
                    <h3>Communication Goals</h3>
                    <div className="checkbox-grid">
                        {['Public Speaker','Interview Prep','Good English Speaker','Confidence Boost','Others'].map(goal=> (
                            <label key={goal} className="chk">
                                <input type="checkbox" checked={!!survey.goals[goal]} onChange={()=>toggleGoal(goal)} /> {goal}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="card">
                    <h3>Current Speaking Level</h3>
                    <div className="options">
                        {["I can manage, but low confidence","I can manage, but fear to speak","I can manage, but grammar & vocabulary issues","I’m a good speaker, need more practice"].map(opt=> (
                            <label key={opt} className={`pill ${survey.speakingLevel===opt? 'active':''}`}>
                                <input type="radio" name="speakingLevel" value={opt} checked={survey.speakingLevel===opt} onChange={(e)=>setSurvey(prev=>({...prev,speakingLevel:e.target.value}))} />
                                {opt}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="card">
                    <h3>Speaking Frequency</h3>
                    <div className="options">
                        {['Daily','2-3 Days Once','No'].map(opt => (
                            <label key={opt} className={`pill ${survey.frequency===opt? 'active':''}`}>
                                <input type="radio" name="frequency" value={opt} checked={survey.frequency===opt} onChange={(e)=>setSurvey(prev=>({...prev,frequency:e.target.value}))} />
                                {opt}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="card">
                    <h3>Reasons for Not Speaking</h3>
                    <div className="checkbox-grid">
                        {['Lack of confidence','Fear of being mocked','Shyness','Poor grammar/vocabulary','No platform for practice','Others'].map(r => (
                            <label key={r} className="chk">
                                <input type="checkbox" checked={!!survey.reasons[r]} onChange={()=>toggleReason(r)} /> {r}
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
