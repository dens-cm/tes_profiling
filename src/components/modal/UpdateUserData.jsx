/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React from 'react'
import * as Chakra from '@chakra-ui/react'
import { ChevronDownIcon, SmallCloseIcon } from '@chakra-ui/icons'
import { TiCloudStorage, TiEdit } from "react-icons/ti"
import { doc, setDoc, onSnapshot } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { firestoreDB, storage } from '../../config/FirebaseConfig'
import { useAuth } from '../../config/Authentication'
import Toast from '../../components/Toast'
import SchoolLogo from '../../assets/tes_logo.png'
import user from '../../assets/user.png'

export default function UpdateUserData({ isOpen, onClose }) {

    const { currentUser, logout } = useAuth()
    const [profileImageFile, setProfileImageFile] = React.useState(null)
    const [userLoading, setUserLoading] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const [userData, setUserData] = React.useState(null)
    const showToast = Toast()

    React.useEffect(() => {
        if (currentUser && currentUser.uid) {
            const docRef = doc(firestoreDB, 'users', currentUser.uid)

            setUserLoading(true)
            const unsubscribe = onSnapshot(
                docRef,
                (doc) => {
                    if (doc.exists()) {
                        const data = doc.data()
                        if (Object.keys(data).length > 0) {
                            setUserData(data)
                            setUserLoading(false)
                        }
                    }

                    else {
                        setUserData(null)
                        setUserLoading(false)
                    }
                },
                (error) => {
                    console.error("Error fetching document:", error)
                    setUserData(null)
                    setUserLoading(false)
                }
            )

            return () => unsubscribe()
        }
    }, [currentUser])

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        setProfileImageFile(file)
    }

    const [formData, setFormData] = React.useState({
        ehrisNo: '',
        active: '',
        firstName: '',
        middleName: '',
        lastName: '',
        extensionName: '',
        gender: '',
        birthdate: '',
        age: '',
        birthplace: '',
        citizenship: '',
        civilStatus: '',
        address: '',
        zipCode: '',
        contactNumber: '',
        emailAddress: '',
        tinNumber: '',
        sssNumber: '',
        philhealth: '',
        gsisNumber: '',
        pagibigNumber: '',
        prcNumber: '',
        prcExpirationDate: '',
        position: '',
        itemNumber: '',
        oldItemNumber: '',
        applicationStatus: '',
        statusOfEmployment: '',
        employeeId: '',
        dateOfLastPromotion: '',
        dateOfOriginalAppointment: '',
        originalDateAsPermanent: '',
        remarksStatus: '',
        adviser: '',
        firstDayOfService: '',
        educationalAttainment: '',
        csEligibility: '',
        plantillaItemNo: '',
        otherCsEligibility: '',
        basicSalary: '',
        profileImageUrl: '',
        status: '',
        userType: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    React.useEffect(() => {
        if (userData) {
            setFormData({
                ...formData,
                ...userData,
            })
        }
    }, [userData])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!currentUser?.uid) {
            showToast({ description: 'No authenticated user found', status: 'error', variant: 'solid', position: 'top' })

            logout()
            return
        }

        setIsLoading(true)

        try {
            let profileImageUrl = formData.profileImageUrl

            if (profileImageFile) {
                const storagePath = `users/${currentUser.uid}/profileImage/${currentUser.uid}.jpg`
                const imageRef = ref(storage, storagePath)

                await uploadBytes(imageRef, profileImageFile)
                profileImageUrl = await getDownloadURL(imageRef)
            }

            const updatedData = {
                ...formData,
                profileImageUrl,
            }

            const docRef = doc(firestoreDB, 'users', currentUser.uid)
            await setDoc(docRef, updatedData, { merge: true })

            showToast({ description: 'Your profile has been updated successfully!', status: 'success', variant: 'solid', position: 'top' })
            onClose()
        }

        catch (error) {
            showToast({ title: 'Error updating profile', description: `${error}`, status: 'error', variant: 'solid', position: 'top' })
        }

        finally {
            setIsLoading(false)
        }
    }

    React.useEffect(() => {
        if (isOpen && userData) {
            setFormData(userData)
        }
    }, [isOpen, userData])

    const handleClose = () => {
        setFormData({})
        setProfileImageFile(null)
        onClose()
    }

    return (
        <Chakra.Modal isOpen={isOpen} onClose={onClose} scrollBehavior='inside' size='full'>
            <Chakra.ModalContent p='0' bg='gray.100' overflow='auto'>
                <Chakra.ModalHeader zIndex='1' p='1% 22% 1% 21%' bg='white' display='flex' justifyContent='space-between' boxShadow='.1vw .1vw .3vw rgba(105, 126, 116, .1)'>
                    <Chakra.Text w='50%' fontSize='1vw' fontWeight='700' color='gray.600' display='flex' alignItems='center'><Chakra.Text mr='1%' fontSize='1.3vw'><TiEdit /></Chakra.Text> Update your Information</Chakra.Text>
                    {isLoading && (
                        <Chakra.Box w='100%' h='100%' display='flex' alignItems='center' justifyContent='center'>
                            <Chakra.Spinner w='1vw' h='1vw' color='gray.500' />
                            <Chakra.Text ml='2%' fontSize='.9vw' fontWeight='bold' color='gray.500'>saving...</Chakra.Text>
                        </Chakra.Box>
                    )}

                    <Chakra.Box display='flex'>
                        <Chakra.Button onClick={handleSubmit} h='1.5vw' mr='5%' fontSize='.8vw' fontWeight='400' colorScheme='teal'  leftIcon={<TiCloudStorage />} isLoading={isLoading} isDisabled={isLoading} borderRadius='0'>Save changes</Chakra.Button>
                        <Chakra.Button onClick={handleClose} h='1.5vw' fontSize='.8vw' fontWeight='400' colorScheme='red' leftIcon={<SmallCloseIcon fontSize='1vw' />} borderRadius='0'>Cancel</Chakra.Button>
                    </Chakra.Box>
                </Chakra.ModalHeader>
                <Chakra.ModalBody>
                    <Chakra.Box w='100%' h='100%' p='2% 20% 2% 20%' bg='gray.100' overflow='auto'>
                        {userLoading ? (
                            <Chakra.Box w='100%' h='100%' display='flex' alignItems='center' justifyContent='center'>
                                <Chakra.Spinner w='1vw' h='1vw' color='gray.500' />
                                <Chakra.Text ml='2%' fontSize='.9vw' fontWeight='bold' color='gray.500'>Fetching data...</Chakra.Text>
                            </Chakra.Box>
                        )
                            :
                            (
                                <Chakra.Box w='100%' p='4.7%' bg='white'>
                                    <Chakra.Box w='100%' mb='2%' display='flex' alignItems='center'>
                                        <Chakra.Image w='3vw' src={SchoolLogo} objectFit='cover' alt='school logo' />
                                        <Chakra.Box w='100%' ml='1.5%' display='flex' flexDirection='column'>
                                            <Chakra.Text fontSize='1.1vw' fontWeight='bold' color='gray.600'>Hi Teacher!</Chakra.Text>
                                            <Chakra.Text fontSize='1vw' fontWeight='400' fontStyle='italic' color='gray.700'>Update your profile to let us know you better.</Chakra.Text>
                                        </Chakra.Box>
                                    </Chakra.Box>
                                    <hr />
                                    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                                        <Chakra.Box w='100%' mt='3%' mb='2%' display='flex' justifyContent='space-between'>
                                            <Chakra.Box w='47.4%' display='flex' flexDirection='column' alignItems='center'>
                                                <Chakra.Image w='15vw' h='15vw' m='2% 0 0 0' src={profileImageFile ? URL.createObjectURL(profileImageFile) : formData.profileImageUrl || user} border='.1vw solid #b9bab6' alt="Profile Preview" />
                                                <Chakra.Input type="file" accept="image/*" onChange={handleImageChange} id="file-input" hidden />
                                                <Chakra.Button onClick={() => document.getElementById('file-input').click()} w='15vw' h='1.8vw' m='4% 0 0 0' colorScheme='blue' fontSize='.9vw' fontWeight='500' borderRadius='0'>Select image</Chakra.Button>
                                            </Chakra.Box>
                                            <Chakra.Box w='47.4%' display='flex' flexDirection='column'>
                                                <Chakra.FormLabel m='0' fontSize='.9vw' color='gray.700'>First name:</Chakra.FormLabel>
                                                <Chakra.Input name="firstName" value={formData.firstName} onChange={handleChange} required h='2.5vw' fontSize='1vw' textTransform='capitalize' variant='filled' borderRadius='0' placeholder='Jaun' />
                                                <Chakra.FormLabel m='4% 0 0 0' fontSize='.9vw' color='gray.700'>Middle name:</Chakra.FormLabel>
                                                <Chakra.Input name="middleName" value={formData.middleName} onChange={handleChange} required h='2.5vw' fontSize='1vw' textTransform='capitalize' variant='filled' borderRadius='0' placeholder='Dela' />
                                                <Chakra.FormLabel m='4% 0 0 0' fontSize='.9vw' color='gray.700'>Last name:</Chakra.FormLabel>
                                                <Chakra.Input name="lastName" value={formData.lastName} onChange={handleChange} required h='2.5vw' fontSize='1vw' textTransform='capitalize' variant='filled' borderRadius='0' placeholder='Cruz' />
                                                <Chakra.FormLabel m='4% 0 0 0' fontSize='.9vw' color='gray.700'>Extension name:</Chakra.FormLabel>
                                                <Chakra.Select name="extensionName" value={formData.extensionName} onChange={handleChange} h='2.5vw' m='0 0 4% 0' variant='filled' fontSize='1vw' textTransform='capitalize' borderRadius='0' display='flex' cursor='pointer' icon={<ChevronDownIcon fontSize="1vw" />}>
                                                    <option value=''>None</option>
                                                    <option value='Jr.'>Jr</option>
                                                    <option value='Sr.'>Sr.</option>
                                                </Chakra.Select>
                                                <hr />
                                                <Chakra.FormLabel m='4% 0 0 0' fontSize='.9vw' color='gray.700'>Ehris no.</Chakra.FormLabel>
                                                <Chakra.Input name="ehrisNo" value={formData.ehrisNo} onChange={handleChange} required h='2.5vw' fontSize='1vw' variant='filled' borderRadius='0' placeholder='...' />
                                                <Chakra.FormLabel m='4% 0 0 0' fontSize='.9vw' color='gray.700'>Active:</Chakra.FormLabel>
                                                <Chakra.Input name="active" value={formData.active} onChange={handleChange} required h='2.5vw' fontSize='1vw' variant='filled' borderRadius='0' placeholder='...' />
                                            </Chakra.Box>
                                        </Chakra.Box>

                                        <hr />
                                        <Chakra.Text mt='4%' mb='.2%' fontSize='1vw' fontWeight='bold' color='gray.600'>Personal Information</Chakra.Text>
                                        <hr />
                                        <Chakra.Box w='100%' mt='2%' mb='3%' display='flex' justifyContent='space-between'>
                                            <Chakra.Box w='47.4%' display='flex' flexDirection='column'>

                                                <Chakra.FormLabel m='0' fontSize='.9vw' color='gray.700'>Gender:</Chakra.FormLabel>
                                                <Chakra.Select name="gender" defaultValue={formData.gender} onChange={handleChange} required h='2.5vw' variant='filled' fontSize='1vw' textTransform='capitalize' borderRadius='0' display='flex' cursor='pointer' icon={<ChevronDownIcon fontSize="1vw" />}>
                                                    <option value='' disabled>Select</option>
                                                    <option value='Male'>Male</option>
                                                    <option value='Female'>Female</option>
                                                </Chakra.Select>
                                                <Chakra.FormLabel m='4% 0 0 0' fontSize='.9vw' color='gray.700'>Birthdate:</Chakra.FormLabel>
                                                <Chakra.Input name="birthdate" value={formData.birthdate} onChange={handleChange} required type='date' h='2.5vw' fontSize='1vw' variant='filled' borderRadius='0' />
                                                <Chakra.FormLabel m='4% 0 0 0' fontSize='.9vw' color='gray.700'>Age:</Chakra.FormLabel>
                                                <Chakra.Input name="age" value={formData.age} onChange={(e) => { const value = e.target.value; if (/^\d*$/.test(value) && value.length <= 2) { handleChange(e) } }} required type='number' h='2.5vw' fontSize='1vw' variant='filled' borderRadius='0' placeholder='...' />
                                                <Chakra.FormLabel m='4% 0 0 0' fontSize='.9vw' color='gray.700'>Birthplace:</Chakra.FormLabel>
                                                <Chakra.Input name="birthplace" value={formData.birthplace} onChange={handleChange} required h='2.5vw' fontSize='1vw' textTransform='capitalize' variant='filled' borderRadius='0' placeholder='...' />
                                                <Chakra.FormLabel m='4% 0 0 0' fontSize='.9vw' color='gray.700'>Address:</Chakra.FormLabel>
                                                <Chakra.Input name="address" value={formData.address} onChange={handleChange} required h='2.5vw' fontSize='1vw' textTransform='capitalize' variant='filled' borderRadius='0' placeholder='...' />
                                            </Chakra.Box>
                                            <Chakra.Box w='47.4%' display='flex' flexDirection='column'>
                                                <Chakra.FormLabel m='0' fontSize='.9vw' color='gray.700'>Citizenship:</Chakra.FormLabel>
                                                <Chakra.Select name="citizenship" defaultValue={formData.citizenship} onChange={handleChange} required h='2.5vw' variant='filled' fontSize='1vw' textTransform='capitalize' borderRadius='0' display='flex' cursor='pointer' icon={<ChevronDownIcon fontSize="1vw" />}>
                                                    <option value='' disabled>Select</option>
                                                    <option value='Filipino'>Filipino</option>
                                                    <option value='Other'>Other</option>
                                                </Chakra.Select>
                                                <Chakra.FormLabel m='4% 0 0 0' fontSize='.9vw' color='gray.700'>Civil status:</Chakra.FormLabel>
                                                <Chakra.Select name="civilStatus" defaultValue={formData.civilStatus} onChange={handleChange} required h='2.5vw' variant='filled' fontSize='1vw' textTransform='capitalize' borderRadius='0' display='flex' cursor='pointer' icon={<ChevronDownIcon fontSize="1vw" />}>
                                                    <option value='' disabled>Select</option>
                                                    <option value='Single'>Single</option>
                                                    <option value='Married'>Married</option>
                                                    <option value='Widowed'>Widowed</option>
                                                </Chakra.Select>
                                                <Chakra.FormLabel m='4% 0 0 0' fontSize='.9vw' color='gray.700'>ZIP code:</Chakra.FormLabel>
                                                <Chakra.Input name="zipCode" value={formData.zipCode} onChange={(e) => { const value = e.target.value; if (/^\d*$/.test(value) && value.length <= 8) { handleChange(e) } }} required type='number' h='2.5vw' fontSize='1vw' variant='filled' borderRadius='0' placeholder='...' />
                                                <Chakra.FormLabel m='4% 0 0 0' fontSize='.9vw' color='gray.700'>Contact number:</Chakra.FormLabel>
                                                <Chakra.Input name="contactNumber" value={formData.contactNumber} onChange={(e) => { const value = e.target.value; if (/^\d*$/.test(value) && value.length <= 11) { handleChange(e) } }} required type='number' h='2.5vw' fontSize='1vw' variant='filled' borderRadius='0' placeholder='...' />
                                                <Chakra.FormLabel m='4% 0 0 0' fontSize='.9vw' color='gray.700'>Email address:</Chakra.FormLabel>
                                                <Chakra.Input name="emailAddress" value={formData.emailAddress} onChange={handleChange} required type='email' h='2.5vw' fontSize='1vw' variant='filled' borderRadius='0' />
                                            </Chakra.Box>
                                        </Chakra.Box>

                                        <hr />
                                        <Chakra.Text mt='4%' mb='.2%' fontSize='1vw' fontWeight='bold' color='gray.600'>IDs</Chakra.Text>
                                        <hr />
                                        <Chakra.Box w='100%' mt='2%' mb='3%' display='flex' justifyContent='space-between'>
                                            <Chakra.Box w='47.4%' display='flex' flexDirection='column'>
                                                <Chakra.FormLabel m='0' fontSize='.9vw' color='gray.700'>TIN number:</Chakra.FormLabel>
                                                <Chakra.Input name="tinNumber" value={formData.tinNumber} onChange={handleChange} required h='2.5vw' fontSize='1vw' textTransform='capitalize' variant='filled' borderRadius='0' placeholder='...' />
                                                <Chakra.FormLabel m='4% 0 0 0' fontSize='.9vw' color='gray.700'>SSS number:</Chakra.FormLabel>
                                                <Chakra.Input name="sssNumber" value={formData.sssNumber} onChange={handleChange} required h='2.5vw' fontSize='1vw' textTransform='capitalize' variant='filled' borderRadius='0' placeholder='...' />
                                                <Chakra.FormLabel m='4% 0 0 0' fontSize='.9vw' color='gray.700'>PhilHealth:</Chakra.FormLabel>
                                                <Chakra.Input name="philhealth" value={formData.philhealth} onChange={handleChange} required h='2.5vw' fontSize='1vw' textTransform='capitalize' variant='filled' borderRadius='0' placeholder='...' />
                                                <Chakra.FormLabel m='4% 0 0 0' fontSize='.9vw' color='gray.700'>GSIS number:</Chakra.FormLabel>
                                                <Chakra.Input name="gsisNumber" value={formData.gsisNumber} onChange={handleChange} required h='2.5vw' fontSize='1vw' variant='filled' borderRadius='0' placeholder='...' />
                                            </Chakra.Box>
                                            <Chakra.Box w='47.4%' display='flex' flexDirection='column'>
                                                <Chakra.FormLabel m='0' fontSize='.9vw' color='gray.700'>Pag-ibig number:</Chakra.FormLabel>
                                                <Chakra.Input name="pagibigNumber" value={formData.pagibigNumber} onChange={handleChange} required h='2.5vw' fontSize='1vw' variant='filled' borderRadius='0' placeholder='...' />
                                                <Chakra.FormLabel m='4% 0 0 0' fontSize='.9vw' color='gray.700'>PRC number:</Chakra.FormLabel>
                                                <Chakra.Input name="prcNumber" value={formData.prcNumber} onChange={handleChange} required h='2.5vw' fontSize='1vw' variant='filled' borderRadius='0' placeholder='...' />
                                                <Chakra.FormLabel m='4% 0 0 0' fontSize='.9vw' fontWeight='400' color='gray.700' fontStyle='italic'>PRC expiration date:</Chakra.FormLabel>
                                                <Chakra.Input name="prcExpirationDate" value={formData.prcExpirationDate} onChange={handleChange} required type='date' h='2.5vw' fontSize='1vw' variant='filled' borderRadius='0' placeholder='...' />
                                            </Chakra.Box>
                                        </Chakra.Box>

                                        <hr />
                                        <Chakra.Text mt='4%' mb='.2%' fontSize='1vw' fontWeight='bold' color='gray.600'>Job Information</Chakra.Text>
                                        <hr />
                                        <Chakra.Box w='100%' mt='2%' mb='3%' display='flex' justifyContent='space-between'>
                                            <Chakra.Box w='47.4%' display='flex' flexDirection='column'>
                                                <Chakra.FormLabel m='0' fontSize='.9vw' color='gray.700'>Position:</Chakra.FormLabel>
                                                <Chakra.Input name="position" value={formData.position} onChange={handleChange} required h='2.5vw' fontSize='1vw' textTransform='capitalize' variant='filled' borderRadius='0' placeholder='Teacher I/Teacher II/Teacher III...' />
                                                <Chakra.FormLabel m='4% 0 0 0' fontSize='.9vw' color='gray.700'>Item number:</Chakra.FormLabel>
                                                <Chakra.Input name="itemNumber" value={formData.itemNumber} onChange={handleChange} required h='2.5vw' fontSize='1vw' textTransform='capitalize' variant='filled' borderRadius='0' placeholder='...' />
                                                <Chakra.FormLabel m='4% 0 0 0' fontSize='.9vw' color='gray.700'>Old Item Number (If promoted through reclassification):</Chakra.FormLabel>
                                                <Chakra.Input name="oldItemNumber" value={formData.oldItemNumber} onChange={handleChange} required h='2.5vw' fontSize='1vw' textTransform='capitalize' variant='filled' borderRadius='0' placeholder='...' />
                                                <Chakra.FormLabel m='4% 0 0 0' fontSize='.9vw' color='gray.700'>Application status:</Chakra.FormLabel>
                                                <Chakra.Select name="applicationStatus" defaultValue={formData.applicationStatus} onChange={handleChange} required h='2.5vw' variant='filled' fontSize='1vw' textTransform='capitalize' borderRadius='0' display='flex' cursor='pointer' icon={<ChevronDownIcon fontSize="1vw" />}>
                                                    <option value='' disabled>Select</option>
                                                    <option value='Permanent'>Permanent</option>
                                                </Chakra.Select>
                                                <Chakra.FormLabel m='4% 0 0 0' fontSize='.9vw' color='gray.700'>Status of employment:</Chakra.FormLabel>
                                                <Chakra.Select name="statusOfEmployment" defaultValue={formData.statusOfEmployment} onChange={handleChange} required h='2.5vw' variant='filled' fontSize='1vw' textTransform='capitalize' borderRadius='0' display='flex' cursor='pointer' icon={<ChevronDownIcon fontSize="1vw" />}>
                                                    <option value='' disabled>Select</option>
                                                    <option value='Filipino'>Permanent Probationary</option>
                                                    <option value='Contactual'>Contactual</option>
                                                    <option value='Temporary'>Temporary</option>
                                                </Chakra.Select>
                                            </Chakra.Box>
                                            <Chakra.Box w='47.4%' display='flex' flexDirection='column'>
                                                <Chakra.FormLabel m='0' fontSize='.9vw' color='gray.700'>Employee ID:</Chakra.FormLabel>
                                                <Chakra.Input name="employeeId" value={formData.employeeId} onChange={handleChange} required h='2.5vw' fontSize='1vw' variant='filled' borderRadius='0' placeholder='...' />
                                                <Chakra.FormLabel m='4% 0 0 0' fontSize='.9vw' color='gray.700'>Date of last promotion:</Chakra.FormLabel>
                                                <Chakra.Input name="dateOfLastPromotion" value={formData.dateOfLastPromotion} onChange={handleChange} required type='date' h='2.5vw' fontSize='1vw' variant='filled' borderRadius='0' />
                                                <Chakra.FormLabel m='4% 0 0 0' fontSize='.9vw' color='gray.700'>Date of original appointment:</Chakra.FormLabel>
                                                <Chakra.Input name="dateOfOriginalAppointment" value={formData.dateOfOriginalAppointment} onChange={handleChange} required type='date' h='2.5vw' fontSize='1vw' variant='filled' borderRadius='0' />
                                                <Chakra.FormLabel m='4% 0 0 0' fontSize='.9vw' color='gray.700'>Original date as permanent:</Chakra.FormLabel>
                                                <Chakra.Input name="originalDateAsPermanent" value={formData.originalDateAsPermanent} onChange={handleChange} required type='date' h='2.5vw' fontSize='1vw' variant='filled' borderRadius='0' />
                                                <Chakra.FormLabel m='4% 0 0 0' fontSize='.9vw' color='gray.700'>Remarks status</Chakra.FormLabel>
                                                <Chakra.Select name="remarksStatus" defaultValue={formData.remarksStatus} onChange={handleChange} required h='2.5vw' variant='filled' fontSize='1vw' textTransform='capitalize' borderRadius='0' display='flex' cursor='pointer' icon={<ChevronDownIcon fontSize="1vw" />}>
                                                    <option value='' disabled>Select</option>
                                                    <option value='Active'>Active</option>
                                                </Chakra.Select>
                                            </Chakra.Box>
                                        </Chakra.Box>

                                        <hr />
                                        <Chakra.Text mt='4%' mb='.2%' fontSize='1vw' fontWeight='bold' color='gray.600'>Others</Chakra.Text>
                                        <hr />
                                        <Chakra.Box w='100%' mt='2%' mb='3%' display='flex' justifyContent='space-between'>
                                            <Chakra.Box w='47.4%' display='flex' flexDirection='column'>
                                                <Chakra.FormLabel m='0' fontSize='.9vw' color='gray.700'>Adviser:</Chakra.FormLabel>
                                                <Chakra.Input name="adviser" value={formData.adviser} onChange={handleChange} required h='2.5vw' fontSize='1vw' textTransform='capitalize' variant='filled' borderRadius='0' placeholder='Ex. Kinder Garten Adviser' />
                                                <Chakra.FormLabel m='4% 0 0 0' fontSize='.9vw' color='gray.700'>First day of Service of Current Station:</Chakra.FormLabel>
                                                <Chakra.Input name="firstDayOfService" value={formData.firstDayOfService} onChange={handleChange} required type='date' h='2.5vw' fontSize='1vw' variant='filled' borderRadius='0' />
                                                <Chakra.FormLabel m='4% 0 0 0' fontSize='.9vw' color='gray.700'>Educational attainment</Chakra.FormLabel>
                                                <Chakra.Input name="educationalAttainment" value={formData.educationalAttainment} onChange={handleChange} required h='2.5vw' fontSize='1vw' textTransform='capitalize' variant='filled' borderRadius='0' placeholder='...' />
                                                <Chakra.FormLabel m='4% 0 0 0' fontSize='.9vw' color='gray.700'>CS Eligibility:</Chakra.FormLabel>
                                                <Chakra.Select name="csEligibility" defaultValue={formData.csEligibility} onChange={handleChange} required h='2.5vw' variant='filled' fontSize='1vw' textTransform='capitalize' borderRadius='0' display='flex' cursor='pointer' icon={<ChevronDownIcon fontSize="1vw" />}>
                                                    <option value='' disabled>Select</option>
                                                    <option value='Licensure Examination for Teachers'>Licensure Examination for Teachers</option>
                                                    <option value='Others'>Other</option>
                                                </Chakra.Select>
                                            </Chakra.Box>
                                            <Chakra.Box w='47.4%' display='flex' flexDirection='column'>
                                                <Chakra.FormLabel m='0' fontSize='.9vw' fontWeight='400' color='gray.700' fontStyle='italic'>Other (for CS Eligibility):</Chakra.FormLabel>
                                                <Chakra.Input name="otherCsEligibility" value={formData.otherCsEligibility} onChange={handleChange} h='2.5vw' fontSize='1vw' textTransform='capitalize' variant='filled' borderRadius='0' placeholder='please specify' disabled={formData.csEligibility !== 'Others'} />
                                                <Chakra.FormLabel m='4% 0 0 0' fontSize='.9vw' color='gray.700'>Plantilla item no:</Chakra.FormLabel>
                                                <Chakra.Input name="plantillaItemNo" value={formData.plantillaItemNo} onChange={handleChange} required h='2.5vw' fontSize='1vw' variant='filled' borderRadius='0' placeholder='...' />
                                                <Chakra.FormLabel m='4% 0 0 0' fontSize='.9vw' color='gray.700'>Basic salary:</Chakra.FormLabel>
                                                <Chakra.Input name="basicSalary" value={formData.basicSalary} onChange={handleChange} required h='2.5vw' fontSize='1vw' variant='filled' borderRadius='0' placeholder='...' />
                                                <Chakra.FormLabel m='4% 0 0 0' fontSize='.9vw' color='white'>|</Chakra.FormLabel>
                                            </Chakra.Box>
                                        </Chakra.Box>

                                        <hr />
                                        <Chakra.Box mt='2%' display='flex' justifyContent='right'>
                                            <Chakra.Button type='submit' h='1.8vw' colorScheme='teal' fontSize='.9vw' fontWeight='400' leftIcon={<TiCloudStorage />} isLoading={isLoading} isDisabled={isLoading} display='flex' alignItems='center' borderRadius='0'>Save changes</Chakra.Button>
                                        </Chakra.Box>
                                        <Chakra.Input hidden name="status" value={formData.status} onChange={handleChange} required h='2.5vw' fontSize='1vw' variant='filled' borderRadius='0' placeholder='...' />
                                        <Chakra.Input hidden name="userType" value={formData.userType} onChange={handleChange} required h='2.5vw' fontSize='1vw' variant='filled' borderRadius='0' placeholder='...' />
                                    </form>
                                </Chakra.Box>
                            )}
                    </Chakra.Box>
                </Chakra.ModalBody>
            </Chakra.ModalContent>
        </Chakra.Modal>
    )
}
