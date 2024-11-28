import React from 'react'
import * as Chakra from '@chakra-ui/react'
import { HiEnvelope } from 'react-icons/hi2'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../config/Authentication'
import Toast from '../components/Toast'
import SchoolLogo from '../assets/tes_logo.png'

export default function ForgotPasswordForm() {

    const emailRef = React.useRef()
    const { resetPassword } = useAuth()
    const [loading, setLoading] = React.useState(false)
    const navigate = useNavigate()
    const showToast = Toast()

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            setLoading(true)
            await resetPassword(emailRef.current.value)
            showToast({ description: "Reset password link sent, check your email.", variant: 'top-accent', status: "success", position: 'top' })
        }

        catch (error) {
            if (error.code === 'auth/user-not-found') {
                setLoading(false)
                showToast({ description: "No account found with this email.", variant: 'top-accent', status: "error", position: 'top' })
            }

            else {
                setLoading(false)
                showToast({ description: `Failed to process request. ${error}`, variant: 'top-accent', status: "error", position: 'top' })
            }
        }

        finally {
            setLoading(false)
        }
    }

    return (
        <Chakra.Box w='100%' h='100%' bg='gray.100' display='flex' flexDirection='column' alignItems='center' justifyContent='center'>
            <Chakra.Card w='25%' p='1%' bg='white' borderRadius='0'>
                <Chakra.Box display='flex'>
                    <Chakra.Image w='2.2vw' h='2.2vw' src={SchoolLogo} />
                    <Chakra.Box w='100%' pl='4%' pb='1%' display='flex' flexDirection='column' justifyContent='center'>
                        <Chakra.Text fontSize='.7vw' fontWeight='700' color='gray.700' textTransform='uppercase'>Tagongon Elementary School</Chakra.Text>
                        <Chakra.Box h='.1px' bg='gray.300'></Chakra.Box>
                        <Chakra.Text mt='.9%' fontSize='.6vw' fontWeight='500' fontStyle='italic' color='gray.700'>PROFILING SYSTEM</Chakra.Text>
                    </Chakra.Box>
                </Chakra.Box>
            </Chakra.Card>
            <Chakra.Card w='25%' mt='1%' p='1.4%' bg='white' borderRadius='0'>
                <Chakra.Text mb='1%' fontSize='1vw' fontWeight='bold' color='gray.700'>Forgot Password?</Chakra.Text>
                <hr />
                <Chakra.Text mt='4%' fontSize='.9vw' fontStyle='italic' color='gray.600'>
                    Enter your registered email address below to receive a password reset link.
                </Chakra.Text>

                <form onSubmit={handleSubmit}>
                    <Chakra.InputGroup h='2.2vw' mt='4%'>
                        <Chakra.Input h='100%' type='email' required ref={emailRef} variant='filled' fontSize='.8vw' borderRadius='0' placeholder='New email address'></Chakra.Input>
                        <Chakra.InputRightElement h='100%' fontSize='.9vw'>
                            <HiEnvelope />
                        </Chakra.InputRightElement>
                    </Chakra.InputGroup>
                    <Chakra.Button w='100%' h='2vw' mt='5%' type='submit' isLoading={loading} rightIcon={<HiEnvelope />} colorScheme='teal' fontSize='.8vw' borderRadius='0'>Send link</Chakra.Button>
                </form>

                <Chakra.Text onClick={() => navigate('/')} mt='5%' fontSize='.9vw' textAlign='center' cursor='pointer' _hover={{ color: 'blue', transition: '.2s', fontWeight: '500', textDecoration: 'underline' }} transition='.2s'>back</Chakra.Text>
            </Chakra.Card>
        </Chakra.Box>
    )
}
