import React from "react";

function Home(){
    return (
        <div>
            <h1>Home </h1>
            <div className="">
                    {/* Interested Fields */}
                    <div className="interested-fields">
                        {userData.user_type === 'free' && (
                            <Link to="/pro-plans">
                                <button className="btn">🚀 Upgrade to Pro</button>
                            </Link>
                        )}
                    </div>
                </div>
            <p>I am a software engineer</p>
        </div>
    )
}

export default Home;