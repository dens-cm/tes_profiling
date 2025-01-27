import React from 'react'
import * as Chakra from '@chakra-ui/react'
import { Helmet } from 'react-helmet'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { BiSolidLogOut } from "react-icons/bi"
import { TiCloudStorage } from "react-icons/ti"
import { doc, setDoc, getDocs, query, collection, where } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { firestoreDB, storage } from '../../config/FirebaseConfig'
import { useAuth } from '../../config/Authentication'
import { useNavigate } from 'react-router-dom'
import Logout from '../../components/modal/Logout'
import Toast from '../../components/Toast'
import SchoolLogo from '../../assets/tes_logo.png'
import user from '../../assets/user.png'
import TES_image from '../../assets/TES_image.jpg'

export default function NewUserForm() {

    const { currentUser, logout } = useAuth()
    const [profileImageFile, setProfileImageFile] = React.useState(null)
    const [isLoading, setIsLoading] = React.useState(false)
    const { isOpen: isOpenLogoutModal, onOpen: onOpenLogoutModal, onClose: onCloseLogoutModal } = Chakra.useDisclosure()
    const navigate = useNavigate()
    const showToast = Toast()

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
        status: 'active',
        userType: 'user'
    })

    const handleChange = (e) => {
        const { name, value } = e.target

        setFormData((prevData) => {
            if (name === 'csEligibility' && value !== 'Others') {
                return {
                    ...prevData,
                    [name]: value,
                    otherCsEligibility: '',
                }
            }
            return {
                ...prevData,
                [name]: value,
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!currentUser?.uid) {
            showToast({ description: 'No authenticated user found', status: 'error', variant: 'solid', position: 'top' })
            logout()
            return
        }

        setIsLoading(true)

        try {
            const querySnapshot = await getDocs(
                query(
                    collection(firestoreDB, 'users'),
                    where('firstName', '==', formData.firstName),
                    where('middleName', '==', formData.middleName),
                    where('lastName', '==', formData.lastName)
                )
            )

            if (!querySnapshot.empty) {
                showToast({ title: 'Duplicate Entry', description: 'A teacher with this full name already exists.', status: 'error', variant: 'solid', position: 'top' })
                setIsLoading(false)
                return
            }

            else {
                let profileImageUrl = formData.profileImageUrl
                let contact = formData.contactNumber

                if (contact.length === 11) {
                    if (profileImageFile) {
                        const storagePath = `users/${currentUser.uid}/profileImage/${currentUser.uid}.jpg`
                        const imageRef = ref(storage, storagePath)

                        await uploadBytes(imageRef, profileImageFile)
                        profileImageUrl = await getDownloadURL(imageRef)
                    }

                    else {
                        const response = await fetch(user)
                        const placeholderBlob = await response.blob()

                        const storagePath = `users/${currentUser.uid}/profileImage/${currentUser.uid}.jpg`
                        const imageRef = ref(storage, storagePath)

                        await uploadBytes(imageRef, placeholderBlob)
                        profileImageUrl = await getDownloadURL(imageRef)
                    }

                    const docRef = doc(firestoreDB, 'users', currentUser.uid)
                    await setDoc(docRef, { ...formData, profileImageUrl }, { merge: true })
                    showToast({ description: 'Your profile has been saved!', status: 'success', variant: 'solid', position: 'top' })
                    navigate('/')
                }

                else {
                    showToast({ description: 'Invalid contact number', status: 'info', variant: 'solid', position: 'top' })
                }
            }
        }

        catch (error) {
            showToast({ title: 'There was an issue saving your data.', description: `${error}`, status: 'error', variant: 'solid', position: 'top' })
        }

        finally {
            setIsLoading(false)
        }
    }

    return (
        <Chakra.Box w='100%' h='100%' backgroundImage={TES_image} userSelect='none'>
            <Chakra.Box w='100%' h='100%' p='2% 20% 2% 20%' bg='rgba(255, 255, 255, .9)' overflow='auto'>
                <Helmet>
                    <title>New Teacher Form - Tagongon Elementary School Profiling System</title>
                    <meta name="description" content="Fill out the New Teacher Form to add and manage teacher information in the Tagongon Elementary School Profiling System." />
                    <link rel="icon" type="image/svg+xml" href="/tes_logo.png" />
                </Helmet>
                <Chakra.Box w='100%' p='4.7%' bg='white' boxShadow='.3vw .3vw .3vw rgb(105, 126, 116, .3)' border={'.1vw solid rgba(185, 186, 182, 0.47)'}>
                    <Chakra.Box w='100%' mb='2%' display='flex' alignItems='center'>
                        <Chakra.Image w='3vw' src={SchoolLogo} objectFit='cover' alt='school logo' />
                        <Chakra.Box w='100%' ml='1.5%' display='flex' flexDirection='column'>
                            <Chakra.Text as="h1" fontSize='1.1vw' fontWeight='bold' color='gray.600'>Hi Teacher!</Chakra.Text>
                            <Chakra.Text as="h6" fontSize='1vw' fontWeight='400' fontStyle='italic' color='gray.700'>Complete your profile to let us know you better.</Chakra.Text>
                        </Chakra.Box>
                    </Chakra.Box>
                    <hr />
                    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                        <Chakra.Box w='100%' mt='3%' mb='2%' display='flex' justifyContent='space-between'>
                            <Chakra.Box w='47.4%' display='flex' flexDirection='column' alignItems='center'>
                                <Chakra.Image w='15vw' h='15vw' m='2% 0 0 0' src={profileImageFile ? URL.createObjectURL(profileImageFile) : formData.profileImageUrl || user} border='.1vw solid #b9bab6' alt="Profile Preview" />
                                <Chakra.Input type="file" accept="image/*" onChange={handleImageChange} id="file-input" hidden />
                                <Chakra.Button onClick={() => document.getElementById('file-input').click()} w='15vw' h='2.3vw' m='4% 0 0 0' colorScheme='blue' fontSize='.9vw' borderRadius='0'>select image</Chakra.Button>
                            </Chakra.Box>
                            <Chakra.Box w='47.4%' display='flex' flexDirection='column'>
                                <Chakra.FormLabel m='0' fontSize='.9vw' color='gray.700'>First name:</Chakra.FormLabel>
                                <Chakra.Input name="firstName" value={formData.firstName} onChange={handleChange} required h='2.5vw' fontSize='1vw' textTransform='capitalize' variant='filled' borderRadius='0' placeholder='Jaun' />
                                <Chakra.FormLabel m='4% 0 0 0' fontSize='.9vw' color='gray.700'>Middle name:</Chakra.FormLabel>
                                <Chakra.Input name="middleName" value={formData.middleName} onChange={handleChange} h='2.5vw' fontSize='1vw' textTransform='capitalize' variant='filled' borderRadius='0' placeholder='Dela' />
                                <Chakra.FormLabel m='4% 0 0 0' fontSize='.9vw' color='gray.700'>Last name:</Chakra.FormLabel>
                                <Chakra.Input name="lastName" value={formData.lastName} onChange={handleChange} required h='2.5vw' fontSize='1vw' textTransform='capitalize' variant='filled' borderRadius='0' placeholder='Cruz' />
                                <Chakra.FormLabel m='4% 0 0 0' fontSize='.9vw' color='gray.700'>Extension name:</Chakra.FormLabel>
                                <Chakra.Select name="extensionName" value={formData.extensionName} onChange={handleChange} h='2.5vw' m='0 0 4% 0' variant='filled' fontSize='1vw' textTransform='capitalize' borderRadius='0' display='flex' cursor='pointer' icon={<ChevronDownIcon fontSize="1vw" />}>
                                    <option value='none'>None</option>
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
                                <Chakra.Input name="contactNumber" value={formData.contactNumber} onChange={(e) => { const value = e.target.value; if (/^\d*$/.test(value) && value.length <= 11) { handleChange(e) } }} required type='number' h='2.5vw' color={(formData.contactNumber?.length || 0) < 11 && 'red'} fontSize='1vw' variant='filled' borderRadius='0' placeholder='...' />
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
                            <Chakra.Button onClick={onOpenLogoutModal} h='1.8vw' colorScheme='blue' fontSize='.8vw' fontWeight='400' leftIcon={<BiSolidLogOut />} isDisabled={isLoading} display='flex' alignItems='center' borderRadius='0'>Logout</Chakra.Button>
                            <Chakra.Box w='.1px' ml='1%' bg='gray'>

                            </Chakra.Box>
                            <Chakra.Button type='submit' h='1.8vw' ml='1%' colorScheme='teal' fontSize='.9vw' leftIcon={<TiCloudStorage />} isLoading={isLoading} isDisabled={isLoading} display='flex' alignItems='center' borderRadius='0'>Save</Chakra.Button>
                        </Chakra.Box>
                        <Chakra.Input hidden name="status" value={formData.status} onChange={handleChange} required h='2.5vw' fontSize='1vw' variant='filled' borderRadius='0' placeholder='...' />
                        <Chakra.Input hidden name="userType" value={formData.userType} onChange={handleChange} required h='2.5vw' fontSize='1vw' variant='filled' borderRadius='0' placeholder='...' />
                    </form>
                </Chakra.Box>

                <Logout isOpen={isOpenLogoutModal} onClose={onCloseLogoutModal} />
            </Chakra.Box>
        </Chakra.Box>
    )
}
