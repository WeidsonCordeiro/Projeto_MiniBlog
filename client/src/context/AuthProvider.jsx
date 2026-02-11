import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children, value }) => {

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

