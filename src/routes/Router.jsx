/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Box } from '@chakra-ui/react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth, Authentication } from '../config/Authentication'
import Register from '../pages/authentication/Register'
import Login from '../pages/authentication/Login'
import Home from '../pages/Home'
import Settings from '../pages/Settings'
import ForgotPasswordForm from '../pages/ForgotPasswordForm'
import NewUserForm from '../pages/forms/NewUserForm'
import PageNotFound from '../404'

export default function App() {

    const PrivateRoutes = ({ children, publicOnly = false }) => {
        const { currentUser } = useAuth()
        const location = useLocation()

        if (currentUser && publicOnly) {
            return <Navigate to="/" />
        }

        if (!currentUser && !publicOnly) {
            return <Navigate to="/login" state={{ from: location }} />
        }

        return children
    }

    return (
        <Box w='100vw' h='100vh'>
            <Router>
                <Authentication>
                    <Routes>
                        <Route exact path='/' element={<PrivateRoutes> <Home /> </PrivateRoutes>} />
                        <Route exact path='/new-user-form' element={<PrivateRoutes> <NewUserForm /> </PrivateRoutes>} />
                        <Route exact path='/settings' element={<PrivateRoutes> <Settings /> </PrivateRoutes>} />
                        <Route exact path='/register' element={<PrivateRoutes publicOnly={true}> <Register /> </PrivateRoutes>} />
                        <Route exact path='/login' element={<PrivateRoutes publicOnly={true}> <Login /> </PrivateRoutes>} />
                        <Route exact path='/forgot-password' element={<PrivateRoutes publicOnly={true}> <ForgotPasswordForm /> </PrivateRoutes>} />
                        <Route exact path='*' element={<PageNotFound />} />
                    </Routes>
                </Authentication>
            </Router>
        </Box>
    )
}
