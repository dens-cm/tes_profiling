import React from 'react'
import * as Chakra from '@chakra-ui/react'
import dayjs from 'dayjs'
import { BiPrinter, BiEditAlt } from "react-icons/bi"
import { useAuth } from '../config/Authentication'
import { doc, onSnapshot } from 'firebase/firestore'
import { firestoreDB } from '../config/FirebaseConfig'
import UpdateUserData from '../components/modal/UpdateUserData'

export default function Profile() {

  const { currentUser } = useAuth()
  const [userLoading, setUserLoading] = React.useState(false)
  const [userData, setUserData] = React.useState(null)
  const [teachingExperience, setTeachingExperience] = React.useState('')
  const { isOpen: isOpenUpdateDataForm, onOpen: onOpenUpdateUserData, onClose: onCloseUpdateUserData } = Chakra.useDisclosure()

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

  React.useEffect(() => {
    const calculateExperience = () => {
      if (userData?.firstDayOfService) {
        const firstDay = dayjs(userData.firstDayOfService)
        const now = dayjs()

        const years = now.diff(firstDay, 'year')
        const months = now.diff(firstDay.add(years, 'year'), 'month')
        const days = now.diff(firstDay.add(years, 'year').add(months, 'month'), 'day')

        const yearText = years === 1 ? 'year' : 'years'
        const monthText = months === 1 ? 'month' : 'months'
        const dayText = days === 1 ? 'day' : 'days'

        const experienceText = `${years} ${yearText}, ${months} ${monthText} and ${days} ${dayText}`
        setTeachingExperience(experienceText)
      }
    }

    calculateExperience()
  }, [userData])

  return (
    <Chakra.Box w='100%' p='2% 15% 2% 15%'>
      {userLoading ? (
        <Chakra.Box w='100%' display='flex' alignItems='center' justifyContent='center'>
          <Chakra.Spinner w='1vw' h='1vw' color='gray.500' />
          <Chakra.Text ml='1%' fontSize='.9vw' fontWeight='bold' fontStyle='italic' color='gray.500'>Fetching data...</Chakra.Text>
        </Chakra.Box>
      )
        :
        (
          <>
            <Chakra.Box w='100%' display='flex' alignItems='center' justifyContent='space-between'>
              <Chakra.Text fontSize='1vw' fontWeight='bold' color='gray.600'>Teacher Information</Chakra.Text>
              <Chakra.Box display='flex'>
                <Chakra.Button h='1.5vw' mr='3%' fontSize='.7vw' fontWeight='500' colorScheme='blue' leftIcon={<BiPrinter />} isDisabled={userLoading} borderRadius='0'>Print</Chakra.Button>
                <Chakra.Button onClick={onOpenUpdateUserData} h='1.5vw' fontSize='.7vw' fontWeight='500' colorScheme='teal' leftIcon={<BiEditAlt />} isDisabled={userLoading} borderRadius='0'>Edit</Chakra.Button>
              </Chakra.Box>
            </Chakra.Box>
            <Chakra.Box w='100%' mt='.5%' p='3%' bg='white' display='flex' boxShadow='.2vw .2vw .3vw rgba(105, 126, 116, .1)'>
              <Chakra.Image w='8vw' h='8vw' border='.1vw solid #b9bab6' src={userData?.profileImageUrl} alt='profile image'/>
              <Chakra.Box w='100%' ml='3%'>
                <Chakra.Text fontSize='1.5vw' fontWeight='700' color='gray.700' textTransform='capitalize'>{userData?.firstName} {userData?.middleName} {userData?.lastName} {userData?.extensionName}</Chakra.Text>
                <Chakra.Box w='100%' mt='2%' p='.1% 0 0 0' display='flex' justifyContent='space-between'>
                  <Chakra.Box w='50%' p='0 0 0 2%' borderLeft='2px solid #b9bab6'>
                    <Chakra.Text fontSize='.8vw' fontWeight='500' textTransform='capitalize' color='gray.600' display='flex'>EHRIS NO. :<Chakra.Text ml='2%' fontWeight='400'>{userData?.ehrisNo}</Chakra.Text></Chakra.Text>
                    <Chakra.Text fontSize='.8vw' fontWeight='500' textTransform='capitalize' color='gray.600' display='flex'>EMPLOYEE ID :<Chakra.Text ml='2%' fontWeight='400'>{userData?.employeeId}</Chakra.Text></Chakra.Text>
                    <Chakra.Text fontSize='.8vw' fontWeight='500' textTransform='capitalize' color='gray.600' display='flex'>REMARKS STATUS :<Chakra.Text ml='2%' fontWeight='400'>{userData?.remarksStatus}</Chakra.Text></Chakra.Text>
                  </Chakra.Box>
                  <Chakra.Box w='50%' p='0 0 0 2%' borderLeft='2px solid #b9bab6'>
                    <Chakra.Text fontSize='.8vw' fontWeight='500' textTransform='capitalize' color='gray.600' display='flex'>POSITION :<Chakra.Text ml='2%' fontWeight='400'>{userData?.position}</Chakra.Text></Chakra.Text>
                    <Chakra.Text fontSize='.8vw' fontWeight='500' textTransform='capitalize' color='gray.600' display='flex'>BASIC SALARY :<Chakra.Text ml='2%' fontWeight='400'>{userData?.basicSalary}</Chakra.Text></Chakra.Text>
                    <Chakra.Text fontSize='.8vw' fontWeight='500' textTransform='capitalize' color='gray.600' display='flex'>ACTIVE :<Chakra.Text ml='2%' fontWeight='400'>{userData?.active}</Chakra.Text></Chakra.Text>
                  </Chakra.Box>
                </Chakra.Box>
              </Chakra.Box>
            </Chakra.Box>

            <Chakra.Box w='100%' mt='1.5%' p='3%' bg='white' boxShadow='.2vw .2vw .3vw rgba(105, 126, 116, .1)'>
              <Chakra.Text fontSize='1vw' fontWeight='700' color='gray.700'>Personal Information</Chakra.Text>
              <Chakra.Box w='100%' h='.1vw' bg='gray.400'></Chakra.Box>
              <Chakra.Box w='100%' display='flex' p='0 2% 0 2%' mt='1%'>
                <Chakra.Box w='100%' display='flex' flexDirection='column' pt='3%'>
                  <Chakra.Box w='100%' display='flex' justifyContent='space-evenly' alignItems='self-end'>
                    <Chakra.Text w='100%' fontSize='.9vw' fontWeight='500' color='gray.600' textAlign='center'>{userData?.age}</Chakra.Text>
                    <Chakra.Text w='100%' fontSize='.9vw' fontWeight='500' color='gray.600' textAlign='center' textTransform='capitalize'>{new Date(userData?.birthdate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Chakra.Text>
                    <Chakra.Text w='100%' fontSize='.9vw' fontWeight='500' color='gray.600' textAlign='center' textTransform='capitalize'>{userData?.birthplace}</Chakra.Text>
                  </Chakra.Box>
                  <hr />
                  <Chakra.Box w='100%' display='flex' justifyContent='space-evenly' alignItems='self-end'>
                    <Chakra.Text w='100%' fontSize='.8vw' textAlign='center' color='gray.500' fontStyle='italic'>Age</Chakra.Text>
                    <Chakra.Text w='100%' fontSize='.8vw' textAlign='center' color='gray.500' fontStyle='italic'>Birthdate</Chakra.Text>
                    <Chakra.Text w='100%' fontSize='.8vw' textAlign='center' color='gray.500' fontStyle='italic'>Birthplace</Chakra.Text>
                  </Chakra.Box>
                </Chakra.Box>
              </Chakra.Box>
              <Chakra.Box w='100%' display='flex' p='0 2% 0 2%' mt='.5%'>
                <Chakra.Box w='100%' display='flex' flexDirection='column' pt='3%'>
                  <Chakra.Box w='100%' display='flex' justifyContent='space-evenly' alignItems='self-end'>
                    <Chakra.Text w='100%' fontSize='.9vw' fontWeight='500' color='gray.600' textAlign='center' textTransform='capitalize'>{userData?.address}</Chakra.Text>
                    <Chakra.Text w='100%' fontSize='.9vw' fontWeight='500' color='gray.600' textAlign='center'>{userData?.zipCode}</Chakra.Text>
                    <Chakra.Text w='100%' fontSize='.9vw' fontWeight='500' color='gray.600' textAlign='center' textTransform='capitalize'>{userData?.gender}</Chakra.Text>
                  </Chakra.Box>
                  <hr />
                  <Chakra.Box w='100%' display='flex' justifyContent='space-evenly' alignItems='self-end'>
                    <Chakra.Text w='100%' fontSize='.8vw' textAlign='center' color='gray.500' fontStyle='italic'>Address</Chakra.Text>
                    <Chakra.Text w='100%' fontSize='.8vw' textAlign='center' color='gray.500' fontStyle='italic'>ZIP code</Chakra.Text>
                    <Chakra.Text w='100%' fontSize='.8vw' textAlign='center' color='gray.500' fontStyle='italic'>Gender</Chakra.Text>
                  </Chakra.Box>
                </Chakra.Box>
              </Chakra.Box>
              <Chakra.Box w='100%' display='flex' p='0 2% 0 2%' mt='.5%'>
                <Chakra.Box w='100%' display='flex' flexDirection='column' pt='3%'>
                  <Chakra.Box w='100%' display='flex' justifyContent='space-evenly' alignItems='self-end'>
                    <Chakra.Text w='100%' fontSize='.9vw' fontWeight='500' color='gray.600' textAlign='center' textTransform='capitalize'>{userData?.civilStatus}</Chakra.Text>
                    <Chakra.Text w='100%' fontSize='.9vw' fontWeight='500' color='gray.600' textAlign='center'>{userData?.contactNumber}</Chakra.Text>
                    <Chakra.Text w='100%' fontSize='.9vw' fontWeight='500' color='gray.600' textAlign='center'>{userData?.emailAddress}</Chakra.Text>
                  </Chakra.Box>
                  <hr />
                  <Chakra.Box w='100%' display='flex' justifyContent='space-evenly' alignItems='self-end'>
                    <Chakra.Text w='100%' fontSize='.8vw' textAlign='center' color='gray.500' fontStyle='italic'>Civil Status</Chakra.Text>
                    <Chakra.Text w='100%' fontSize='.8vw' textAlign='center' color='gray.500' fontStyle='italic'>Contact Number</Chakra.Text>
                    <Chakra.Text w='100%' fontSize='.8vw' textAlign='center' color='gray.500' fontStyle='italic'>Email Address</Chakra.Text>
                  </Chakra.Box>
                </Chakra.Box>
              </Chakra.Box>
              <Chakra.Box w='100%' display='flex' p='0 2% 0 2%' mt='.5%'>
                <Chakra.Box w='100%' display='flex' flexDirection='column' pt='3%'>
                  <Chakra.Box w='100%' display='flex' justifyContent='space-evenly' alignItems='self-end'>
                    <Chakra.Text w='100%' fontSize='.9vw' fontWeight='500' color='gray.600' textAlign='center' textTransform='capitalize'>{userData?.citizenship}</Chakra.Text>
                    <Chakra.Text w='100%' fontSize='.9vw' fontWeight='500' color='#0000' textAlign='center'>{userData?.citizenship}</Chakra.Text>
                    <Chakra.Text w='100%' fontSize='.9vw' fontWeight='500' color='#0000' textAlign='center'>{userData?.citizenship}</Chakra.Text>
                  </Chakra.Box>
                  <hr />
                  <Chakra.Box w='100%' display='flex' justifyContent='space-evenly' alignItems='self-end'>
                    <Chakra.Text w='100%' fontSize='.8vw' textAlign='center' color='gray.500' fontStyle='italic'>Citizenship</Chakra.Text>
                    <Chakra.Text w='100%' fontSize='.8vw' textAlign='center' color='#0000' fontStyle='italic'>Citizenship</Chakra.Text>
                    <Chakra.Text w='100%' fontSize='.8vw' textAlign='center' color='#0000' fontStyle='italic'>Citizenship</Chakra.Text>
                  </Chakra.Box>
                </Chakra.Box>
              </Chakra.Box>
            </Chakra.Box>

            <Chakra.Box w='100%' mt='1.5%' p='3%' bg='white' boxShadow='.2vw .2vw .3vw rgba(105, 126, 116, .1)'>
              <Chakra.Text fontSize='1vw' fontWeight='700' color='gray.700'>Job Information</Chakra.Text>
              <Chakra.Box w='100%' h='.1vw' bg='gray.400'></Chakra.Box>
              <Chakra.Box w='100%' display='flex' p='0 2% 0 2%' mt='1%'>
                <Chakra.Box w='100%' display='flex' flexDirection='column' pt='3%'>
                  <Chakra.Box w='100%' display='flex' justifyContent='space-evenly' alignItems='self-end'>
                    <Chakra.Text w='100%' fontSize='.9vw' fontWeight='500' color='gray.600' textAlign='center' textTransform='capitalize'>{userData?.position}</Chakra.Text>
                    <Chakra.Text w='100%' fontSize='.9vw' fontWeight='500' color='gray.600' textAlign='center' textTransform='capitalize'>{userData?.itemNumber}</Chakra.Text>
                    <Chakra.Text w='100%' fontSize='.9vw' fontWeight='500' color='gray.600' textAlign='center' textTransform='capitalize'>{userData?.oldItemNumber}</Chakra.Text>
                  </Chakra.Box>
                  <hr />
                  <Chakra.Box w='100%' display='flex' justifyContent='space-evenly' alignItems='self-end'>
                    <Chakra.Text w='100%' fontSize='.8vw' textAlign='center' color='gray.500' fontStyle='italic'>Position</Chakra.Text>
                    <Chakra.Text w='100%' fontSize='.8vw' textAlign='center' color='gray.500' fontStyle='italic'>Item number</Chakra.Text>
                    <Chakra.Text w='100%' fontSize='.8vw' textAlign='center' color='gray.500' fontStyle='italic'>Old Item number</Chakra.Text>
                  </Chakra.Box>
                </Chakra.Box>
              </Chakra.Box>
              <Chakra.Box w='100%' display='flex' p='0 2% 0 2%' mt='.5%'>
                <Chakra.Box w='100%' display='flex' flexDirection='column' pt='3%'>
                  <Chakra.Box w='100%' display='flex' justifyContent='space-evenly' alignItems='self-end'>
                    <Chakra.Text w='100%' fontSize='.9vw' fontWeight='500' color='gray.600' textAlign='center' textTransform='capitalize'>{userData?.applicationStatus}</Chakra.Text>
                    <Chakra.Text w='100%' fontSize='.9vw' fontWeight='500' color='gray.600' textAlign='center' textTransform='capitalize'>{userData?.statusOfEmployment}</Chakra.Text>
                    <Chakra.Text w='100%' fontSize='.9vw' fontWeight='500' color='gray.600' textAlign='center' textTransform='capitalize'>{new Date(userData?.dateOfLastPromotion).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Chakra.Text>
                  </Chakra.Box>
                  <hr />
                  <Chakra.Box w='100%' display='flex' justifyContent='space-evenly' alignItems='self-end'>
                    <Chakra.Text w='100%' fontSize='.8vw' textAlign='center' color='gray.500' fontStyle='italic'>Application Status</Chakra.Text>
                    <Chakra.Text w='100%' fontSize='.8vw' textAlign='center' color='gray.500' fontStyle='italic'>Status of Employment</Chakra.Text>
                    <Chakra.Text w='100%' fontSize='.8vw' textAlign='center' color='gray.500' fontStyle='italic'>Date of Last Promotion</Chakra.Text>
                  </Chakra.Box>
                </Chakra.Box>
              </Chakra.Box>
              <Chakra.Box w='100%' display='flex' p='0 2% 0 2%' mt='.5%'>
                <Chakra.Box w='100%' display='flex' flexDirection='column' pt='3%'>
                  <Chakra.Box w='100%' display='flex' justifyContent='space-evenly' alignItems='self-end'>
                    <Chakra.Text w='100%' fontSize='.9vw' fontWeight='500' color='gray.600' textAlign='center' textTransform='capitalize'>{userData?.employeeId}</Chakra.Text>
                    <Chakra.Text w='100%' fontSize='.9vw' fontWeight='500' color='gray.600' textAlign='center'>{new Date(userData?.dateOfOriginalAppointment).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Chakra.Text>
                    <Chakra.Text w='100%' fontSize='.9vw' fontWeight='500' color='gray.600' textAlign='center' textTransform='capitalize'>{userData?.remarksStatus}</Chakra.Text>
                  </Chakra.Box>
                  <hr />
                  <Chakra.Box w='100%' display='flex' justifyContent='space-evenly' alignItems='self-end'>
                    <Chakra.Text w='100%' fontSize='.8vw' textAlign='center' color='gray.500' fontStyle='italic'>Employee ID</Chakra.Text>
                    <Chakra.Text w='100%' fontSize='.8vw' textAlign='center' color='gray.500' fontStyle='italic'>Date of Original Appointment</Chakra.Text>
                    <Chakra.Text w='100%' fontSize='.8vw' textAlign='center' color='gray.500' fontStyle='italic'>Remarks Status</Chakra.Text>
                  </Chakra.Box>
                </Chakra.Box>
              </Chakra.Box>
              <Chakra.Box w='100%' display='flex' p='0 2% 0 2%' mt='.5%'>
                <Chakra.Box w='100%' display='flex' flexDirection='column' pt='3%'>
                  <Chakra.Box w='100%' display='flex' justifyContent='space-evenly' alignItems='self-end'>
                    <Chakra.Text w='100%' fontSize='.9vw' fontWeight='500' color='gray.600' textAlign='center' textTransform='capitalize'>{new Date(userData?.originalDateAsPermanent).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Chakra.Text>
                    <Chakra.Text w='100%' fontSize='.9vw' fontWeight='500' color='#0000' textAlign='center'>{new Date(userData?.originalDateAsPermanent).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Chakra.Text>
                    <Chakra.Text w='100%' fontSize='.9vw' fontWeight='500' color='#0000' textAlign='center'>{new Date(userData?.originalDateAsPermanent).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Chakra.Text>
                  </Chakra.Box>
                  <hr />
                  <Chakra.Box w='100%' display='flex' justifyContent='space-evenly' alignItems='self-end'>
                    <Chakra.Text w='100%' fontSize='.8vw' textAlign='center' color='gray.500' fontStyle='italic'>Original date as Permanent</Chakra.Text>
                    <Chakra.Text w='100%' fontSize='.8vw' textAlign='center' color='#0000' fontStyle='italic'>CitizenshOriginal date as Permanentip</Chakra.Text>
                    <Chakra.Text w='100%' fontSize='.8vw' textAlign='center' color='#0000' fontStyle='italic'>Original date as Permanent</Chakra.Text>
                  </Chakra.Box>
                </Chakra.Box>
              </Chakra.Box>
            </Chakra.Box>

            <Chakra.Box w='100%' mt='1.5%' p='3%' bg='white' boxShadow='.2vw .2vw .3vw rgba(105, 126, 116, .1)'>
              <Chakra.Text fontSize='1vw' fontWeight='700' color='gray.700'>IDs</Chakra.Text>
              <Chakra.Box w='100%' h='.1vw' bg='gray.400'></Chakra.Box>
              <Chakra.Box w='100%' display='flex' p='0 2% 0 2%' mt='1%'>
                <Chakra.Box w='100%' display='flex' flexDirection='column' pt='3%'>
                  <Chakra.Box w='100%' display='flex' justifyContent='space-evenly' alignItems='self-end'>
                    <Chakra.Text w='100%' fontSize='.9vw' fontWeight='500' color='gray.600' textAlign='center' textTransform='capitalize'>{userData?.tinNumber}</Chakra.Text>
                    <Chakra.Text w='100%' fontSize='.9vw' fontWeight='500' color='gray.600' textAlign='center' textTransform='capitalize'>{userData?.sssNumber}</Chakra.Text>
                    <Chakra.Text w='100%' fontSize='.9vw' fontWeight='500' color='gray.600' textAlign='center' textTransform='capitalize'>{userData?.philhealth}</Chakra.Text>
                  </Chakra.Box>
                  <hr />
                  <Chakra.Box w='100%' display='flex' justifyContent='space-evenly' alignItems='self-end'>
                    <Chakra.Text w='100%' fontSize='.8vw' textAlign='center' color='gray.500' fontStyle='italic'>TIN number</Chakra.Text>
                    <Chakra.Text w='100%' fontSize='.8vw' textAlign='center' color='gray.500' fontStyle='italic'>SSS number</Chakra.Text>
                    <Chakra.Text w='100%' fontSize='.8vw' textAlign='center' color='gray.500' fontStyle='italic'>PhilHealth number</Chakra.Text>
                  </Chakra.Box>
                </Chakra.Box>
              </Chakra.Box>
              <Chakra.Box w='100%' display='flex' p='0 2% 0 2%' mt='.5%'>
                <Chakra.Box w='100%' display='flex' flexDirection='column' pt='3%'>
                  <Chakra.Box w='100%' display='flex' justifyContent='space-evenly' alignItems='self-end'>
                    <Chakra.Text w='100%' fontSize='.9vw' fontWeight='500' color='gray.600' textAlign='center' textTransform='capitalize'>{userData?.pagibigNumber}</Chakra.Text>
                    <Chakra.Text w='100%' fontSize='.9vw' fontWeight='500' color='gray.600' textAlign='center' textTransform='capitalize'>{userData?.prcNumber}</Chakra.Text>
                    <Chakra.Text w='100%' fontSize='.9vw' fontWeight='500' color='gray.600' textAlign='center'>{new Date(userData?.prcExpirationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Chakra.Text>
                  </Chakra.Box>
                  <hr />
                  <Chakra.Box w='100%' display='flex' justifyContent='space-evenly' alignItems='self-end'>
                    <Chakra.Text w='100%' fontSize='.8vw' textAlign='center' color='gray.500' fontStyle='italic'>Pag-ibig number</Chakra.Text>
                    <Chakra.Text w='100%' fontSize='.8vw' textAlign='center' color='gray.500' fontStyle='italic'>PRC number</Chakra.Text>
                    <Chakra.Text w='100%' fontSize='.8vw' textAlign='center' color='gray.500' fontStyle='italic'>PRC Expiration date</Chakra.Text>
                  </Chakra.Box>
                </Chakra.Box>
              </Chakra.Box>
              <Chakra.Box w='100%' display='flex' p='0 2% 0 2%' mt='.5%'>
                <Chakra.Box w='100%' display='flex' flexDirection='column' pt='3%'>
                  <Chakra.Box w='100%' display='flex' justifyContent='space-evenly' alignItems='self-end'>
                    <Chakra.Text w='100%' fontSize='.9vw' fontWeight='500' color='gray.600' textAlign='center' textTransform='capitalize'>{userData?.gsisNumber}</Chakra.Text>
                    <Chakra.Text w='100%' fontSize='.9vw' fontWeight='500' color='#0000' textAlign='center' textTransform='capitalize'>{userData?.gsisNumber}</Chakra.Text>
                    <Chakra.Text w='100%' fontSize='.9vw' fontWeight='500' color='#0000' textAlign='center'>{userData?.gsisNumber}</Chakra.Text>
                  </Chakra.Box>
                  <hr />
                  <Chakra.Box w='100%' display='flex' justifyContent='space-evenly' alignItems='self-end'>
                    <Chakra.Text w='100%' fontSize='.8vw' textAlign='center' color='gray.500' fontStyle='italic'>GSIS number</Chakra.Text>
                    <Chakra.Text w='100%' fontSize='.8vw' textAlign='center' color='#0000' fontStyle='italic'>GSIS number</Chakra.Text>
                    <Chakra.Text w='100%' fontSize='.8vw' textAlign='center' color='#0000' fontStyle='italic'>GSIS number</Chakra.Text>
                  </Chakra.Box>
                </Chakra.Box>
              </Chakra.Box>
            </Chakra.Box>

            <Chakra.Box w='100%' mt='1.5%' p='3%' bg='white' boxShadow='.2vw .2vw .3vw rgba(105, 126, 116, .1)'>
              <Chakra.Text fontSize='1vw' fontWeight='700' color='gray.700'>Others</Chakra.Text>
              <Chakra.Box w='100%' h='.1vw' bg='gray.400'></Chakra.Box>
              <Chakra.Box w='100%' display='flex' p='0 2% 0 2%' mt='1%'>
                <Chakra.Box w='100%' display='flex' flexDirection='column' pt='3%'>
                  <Chakra.Box w='100%' display='flex' justifyContent='space-evenly' alignItems='self-end'>
                    <Chakra.Text w='100%' fontSize='.9vw' fontWeight='500' color='gray.600' textAlign='center' textTransform='capitalize'>{userData?.adviser}</Chakra.Text>
                    <Chakra.Text w='100%' fontSize='.9vw' fontWeight='500' color='gray.600' textAlign='center' textTransform='capitalize'>{userData?.csEligibility === 'Others' ? `${userData.otherCsEligibility}` : userData?.csEligibility}</Chakra.Text>
                    <Chakra.Text w='100%' fontSize='.9vw' fontWeight='500' color='gray.600' textAlign='center' textTransform='capitalize'>{new Date(userData?.firstDayOfService).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Chakra.Text>
                  </Chakra.Box>
                  <hr />
                  <Chakra.Box w='100%' display='flex' justifyContent='space-evenly' alignItems='self-end'>
                    <Chakra.Text w='100%' fontSize='.8vw' textAlign='center' color='gray.500' fontStyle='italic'>Adviser</Chakra.Text>
                    <Chakra.Text w='100%' fontSize='.8vw' textAlign='center' color='gray.500' fontStyle='italic'>CS Eligibility</Chakra.Text>
                    <Chakra.Text w='100%' fontSize='.8vw' textAlign='center' color='gray.500' fontStyle='italic'>First day of Service</Chakra.Text>
                  </Chakra.Box>
                </Chakra.Box>
              </Chakra.Box>
              <Chakra.Box w='100%' display='flex' p='0 2% 0 2%' mt='.5%'>
                <Chakra.Box w='100%' display='flex' flexDirection='column' pt='3%'>
                  <Chakra.Box w='100%' display='flex' justifyContent='space-evenly' alignItems='self-end'>
                    <Chakra.Text w='100%' fontSize='.9vw' fontWeight='500' color='gray.600' textAlign='center' textTransform='capitalize'>{userData?.educationalAttainment}</Chakra.Text>
                    <Chakra.Text w='100%' fontSize='.9vw' fontWeight='500' color='gray.600' textAlign='center' textTransform='capitalize'>{userData?.plantillaItemNo}</Chakra.Text>
                    <Chakra.Text w='100%' fontSize='.9vw' fontWeight='500' color='gray.600' textAlign='center' textTransform='capitalize'>{userData?.basicSalary}</Chakra.Text>
                  </Chakra.Box>
                  <hr />
                  <Chakra.Box w='100%' display='flex' justifyContent='space-evenly' alignItems='self-end'>
                    <Chakra.Text w='100%' fontSize='.8vw' textAlign='center' color='gray.500' fontStyle='italic'>Educational Attainment</Chakra.Text>
                    <Chakra.Text w='100%' fontSize='.8vw' textAlign='center' color='gray.500' fontStyle='italic'>Plantilla item no.</Chakra.Text>
                    <Chakra.Text w='100%' fontSize='.8vw' textAlign='center' color='gray.500' fontStyle='italic'>Basic Salary</Chakra.Text>
                  </Chakra.Box>
                </Chakra.Box>
              </Chakra.Box>
              <Chakra.Box w='100%' display='flex' p='0 2% 0 2%' mt='.5%'>
                <Chakra.Box w='100%' display='flex' flexDirection='column' pt='3%'>
                  <Chakra.Box w='100%' display='flex' justifyContent='space-evenly' alignItems='self-end'>
                    <Chakra.Text w='100%' fontSize='.9vw' fontWeight='500' color='gray.600' textAlign='center' textTransform='capitalize'>{teachingExperience}</Chakra.Text>
                    <Chakra.Text w='100%' fontSize='.9vw' fontWeight='500' color='#0000' textAlign='center' textTransform='capitalize'>{userData?.gsisNumber}</Chakra.Text>
                    <Chakra.Text w='100%' fontSize='.9vw' fontWeight='500' color='#0000' textAlign='center'>{userData?.gsisNumber}</Chakra.Text>
                  </Chakra.Box>
                  <hr />
                  <Chakra.Box w='100%' display='flex' justifyContent='space-evenly' alignItems='self-end'>
                    <Chakra.Text w='100%' fontSize='.8vw' textAlign='center' color='gray.500' fontStyle='italic'>Teaching experience</Chakra.Text>
                    <Chakra.Text w='100%' fontSize='.8vw' textAlign='center' color='#0000' fontStyle='italic'>Teaching experience</Chakra.Text>
                    <Chakra.Text w='100%' fontSize='.8vw' textAlign='center' color='#0000' fontStyle='italic'>Teaching experience</Chakra.Text>
                  </Chakra.Box>
                </Chakra.Box>
              </Chakra.Box>
            </Chakra.Box>
          </>
        )}

      <UpdateUserData isOpen={isOpenUpdateDataForm} onClose={onCloseUpdateUserData} />
    </Chakra.Box>
  )
}
