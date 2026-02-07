import { useEffect, useState } from "react";

const getUserType = (profile) =>
    profile?.user_type === "premium" && profile?.premium_status === "active" ? "premium" : "free";

const normalizeBody = (payload) => {
    if (!payload?.body) return null;
    return typeof payload.body === "string" ? JSON.parse(payload.body) : payload.body;
};

const useInterviewUserInfo = () => {
    const [userType, setUserType] = useState("free");
    const [streakData, setStreakData] = useState({ current_streak: 0 });
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        const storedEmail = localStorage.getItem("email");
        if (!storedEmail) return;

        const fetchUserData = async () => {
            try {
                const [profileResponse, streakResponse] = await Promise.all([
                    fetch(import.meta.env.VITE_STUDENT_PROFILE_API, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ college_email: storedEmail }),
                    }),
                    fetch(import.meta.env.VITE_UPDATE_USER_STREAK_API, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            body: JSON.stringify({
                                college_email: storedEmail,
                                get_streak_data: true,
                            }),
                        }),
                    }),
                ]);

                if (profileResponse.ok) {
                    const profilePayload = await profileResponse.json();
                    const profile = normalizeBody(profilePayload);
                    if (profile) {
                        setProfileData(profile);
                        setUserType(getUserType(profile));
                    }
                }

                if (streakResponse.ok) {
                    const streakPayload = await streakResponse.json();
                    const streak = normalizeBody(streakPayload);
                    if (streak) setStreakData(streak);
                }
            } catch (error) {
                console.error("Error fetching interview user data:", error);
            }
        };

        fetchUserData();
    }, []);

    return {
        userType,
        streakData,
        profileData,
        email: profileData?.college_email || localStorage.getItem("email") || "",
        isPremium: userType === "premium",
    };
};

export default useInterviewUserInfo;
