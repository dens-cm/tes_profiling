/* eslint-disable react/prop-types */
import React from 'react'
import dayjs from 'dayjs'
import * as Chakra from '@chakra-ui/react'
import { HiPhone, HiMiniMapPin, HiEnvelope } from 'react-icons/hi2'
import { BiPrinter, BiEditAlt } from "react-icons/bi"
import { useReactToPrint } from 'react-to-print'
import { useAuth } from '../config/Authentication'
import useFetchCertificates from '../hooks/data/userCertificates'
import UpdateUserData from '../components/modal/UpdateUserData'

export default function Profile({ userData, userLoading }) {

  const { currentUser } = useAuth()
  const { certificates } = useFetchCertificates(currentUser)
  const [loading, setLoading] = React.useState()
  const [teachingExperience, setTeachingExperience] = React.useState('')
  const { isOpen: isOpenUpdateDataForm, onOpen: onOpenUpdateUserData, onClose: onCloseUpdateUserData } = Chakra.useDisclosure()
  const contentRef = React.useRef(null)

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

  const handlePrint = useReactToPrint({
    contentRef,
    removeAfterPrint: true,
    includeStyles: true,
    pageStyle: `
        @media print {
            body {
                -webkit-print-color-adjust: exact;

            }
            @page {
                margin: 1in !important; 
            }
        }
    `,
    onBeforeGetContent: () => {
      setLoading(true)
    },

    onAfterPrint: () => {
      setLoading(false)
    },
  })

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
                <Chakra.Button onClick={handlePrint} h='1.5vw' mr='3%' fontSize='.7vw' fontWeight='500' colorScheme='blue' leftIcon={<BiPrinter />} isLoading={loading} isDisabled={userLoading} borderRadius='0'>Print</Chakra.Button>
                <Chakra.Button onClick={onOpenUpdateUserData} h='1.5vw' fontSize='.7vw' fontWeight='500' colorScheme='teal' leftIcon={<BiEditAlt />} isDisabled={userLoading} borderRadius='0'>Edit</Chakra.Button>
              </Chakra.Box>
            </Chakra.Box>

            <Chakra.Box w='100%' mt='.5%' p='3%' bg='white' display='flex' boxShadow='.2vw .2vw .3vw rgba(105, 126, 116, .1)'>
              <Chakra.Image w='8vw' h='8vw' border='.1vw solid #b9bab6' src={userData?.profileImageUrl} alt='profile image' />
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

      {/* printable layout */}
      <Chakra.Box w='100%' mt='5%' hidden>
        <Chakra.Box ref={contentRef} w='816px' userSelect='none' color='gray.800'>
          <Chakra.Box w='100%'>
            <Chakra.Box w='100%' display='flex'>
              <Chakra.Image w='140px' h='140px' src={`${userData?.profileImageUrl}`} border='1px solid gray' alt='profile image' />
              <Chakra.Box w='100%' ml='30px'>
                <Chakra.Text fontSize='18px' fontWeight='bold' textTransform='capitalize'>{`${userData?.firstName} ${userData?.middleName} ${userData?.lastName} ${userData?.extensionName}`}</Chakra.Text>
                <Chakra.Text fontSize='14px' fontWeight='400' textTransform='capitalize'>{`${userData?.adviser}`}</Chakra.Text>

                <Chakra.Text mt='17px' fontSize='14px' fontWeight='400' display='flex' alignItems='center'><Chakra.Text mr='1%' fontWeight='500' display='flex'><HiPhone /></Chakra.Text>: {userData?.contactNumber}</Chakra.Text>
                <Chakra.Text fontSize='14px' fontWeight='400' display='flex' alignItems='center' textTransform='capitalize'><Chakra.Text mr='1%' fontWeight='500' display='flex'><HiMiniMapPin /></Chakra.Text>: {userData?.address}</Chakra.Text>
                <Chakra.Text fontSize='14px' fontWeight='400' display='flex' alignItems='center'><Chakra.Text mr='1%' fontWeight='500' display='flex'><HiEnvelope /></Chakra.Text>: {userData?.emailAddress}</Chakra.Text>
              </Chakra.Box>
            </Chakra.Box>

            <Chakra.Text mt='60px' fontSize='14px' fontWeight='700'>PERSONAL INFORMATION</Chakra.Text>
            <Chakra.Box w='100%' h='2px' bg='gray.800'></Chakra.Box>

            <Chakra.Box w='100%' p='0 2% 0 2%'>
              <Chakra.Box w='100%' mt='10px' p='0 2% 0 2%' display='flex'>
                <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>Age:</Chakra.Text>
                <Chakra.Text fontSize='14px' fontWeight='400'>{userData?.age}</Chakra.Text>
              </Chakra.Box>
              <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
              <Chakra.Box w='100%' mt='5px' p='0 2% 0 2%' display='flex'>
                <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>Birthdate:</Chakra.Text>
                <Chakra.Text fontSize='14px' fontWeight='400'>{new Date(userData?.birthdate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Chakra.Text>
              </Chakra.Box>
              <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
              <Chakra.Box w='100%' mt='5px' p='0 2% 0 2%' display='flex'>
                <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>Birthplace:</Chakra.Text>
                <Chakra.Text fontSize='14px' fontWeight='400' textTransform='capitalize'>{userData?.birthplace}</Chakra.Text>
              </Chakra.Box>
              <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
              <Chakra.Box w='100%' mt='5px' p='0 2% 0 2%' display='flex'>
                <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>Gender:</Chakra.Text>
                <Chakra.Text fontSize='14px' fontWeight='400'>{userData?.gender}</Chakra.Text>
              </Chakra.Box>
              <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
              <Chakra.Box w='100%' mt='5px' p='0 2% 0 2%' display='flex'>
                <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>Civil Status:</Chakra.Text>
                <Chakra.Text fontSize='14px' fontWeight='400'>{userData?.civilStatus}</Chakra.Text>
              </Chakra.Box>
              <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
              <Chakra.Box w='100%' mt='5px' p='0 2% 0 2%' display='flex'>
                <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>Citizenship:</Chakra.Text>
                <Chakra.Text fontSize='14px' fontWeight='400'>{userData?.citizenship}</Chakra.Text>
              </Chakra.Box>
              <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
            </Chakra.Box>

            <Chakra.Text mt='60px' fontSize='14px' fontWeight='700'>JOB INFORMATION</Chakra.Text>
            <Chakra.Box w='100%' h='2px' bg='gray.800'></Chakra.Box>

            <Chakra.Box w='100%' p='0 2% 0 2%'>
              <Chakra.Box w='100%' mt='10px' p='0 2% 0 2%' display='flex'>
                <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>Ehris No. :</Chakra.Text>
                <Chakra.Text fontSize='14px' fontWeight='400' textTransform='capitalize'>{userData?.ehrisNumber}</Chakra.Text>
              </Chakra.Box>
              <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
              <Chakra.Box w='100%' mt='5px' p='0 2% 0 2%' display='flex'>
                <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>Employee ID:</Chakra.Text>
                <Chakra.Text fontSize='14px' fontWeight='400'>{userData?.employeeId}</Chakra.Text>
              </Chakra.Box>
              <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
              <Chakra.Box w='100%' mt='5px' p='0 2% 0 2%' display='flex'>
                <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>Position:</Chakra.Text>
                <Chakra.Text fontSize='14px' fontWeight='400' textTransform='capitalize'>{userData?.position}</Chakra.Text>
              </Chakra.Box>
              <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
              <Chakra.Box w='100%' mt='5px' p='0 2% 0 2%' display='flex'>
                <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>Active:</Chakra.Text>
                <Chakra.Text fontSize='14px' fontWeight='400' textTransform='capitalize'>{userData?.active}</Chakra.Text>
              </Chakra.Box>
              <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
              <Chakra.Box w='100%' mt='5px' p='0 2% 0 2%' display='flex'>
                <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>Application Status:</Chakra.Text>
                <Chakra.Text fontSize='14px' fontWeight='400'>{userData?.applicationStatus}</Chakra.Text>
              </Chakra.Box>
              <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
              <Chakra.Box w='100%' mt='5px' p='0 2% 0 2%' display='flex'>
                <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>Status of Employment:</Chakra.Text>
                <Chakra.Text fontSize='14px' fontWeight='400'>{userData?.statusOfEmployment}</Chakra.Text>
              </Chakra.Box>
              <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
              <Chakra.Box w='100%' mt='5px' p='0 2% 0 2%' display='flex'>
                <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>Item Number:</Chakra.Text>
                <Chakra.Text fontSize='14px' fontWeight='400'>{userData?.itemNumber}</Chakra.Text>
              </Chakra.Box>
              <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
              <Chakra.Box w='100%' mt='5px' p='0 2% 0 2%' display='flex'>
                <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>Old Item Number:</Chakra.Text>
                <Chakra.Text fontSize='14px' fontWeight='400'>{userData?.oldItemNumber}</Chakra.Text>
              </Chakra.Box>
              <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
              <Chakra.Box w='100%' mt='5px' p='0 2% 0 2%' display='flex'>
                <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>Original date as Permanent:</Chakra.Text>
                <Chakra.Text fontSize='14px' fontWeight='400'>{new Date(userData?.originalDateAsPermanent).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Chakra.Text>
              </Chakra.Box>
              <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
              <Chakra.Box w='100%' mt='5px' p='0 2% 0 2%' display='flex'>
                <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>Date of original Appointment:</Chakra.Text>
                <Chakra.Text fontSize='14px' fontWeight='400'>{new Date(userData?.dateOfOriginalAppointment).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Chakra.Text>
              </Chakra.Box>
              <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
              <Chakra.Box w='100%' mt='5px' p='0 2% 0 2%' display='flex'>
                <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>Date of Last Promotion:</Chakra.Text>
                <Chakra.Text fontSize='14px' fontWeight='400'>{new Date(userData?.dateOfLastPromotion).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Chakra.Text>
              </Chakra.Box>
              <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
              <Chakra.Box w='100%' mt='5px' p='0 2% 0 2%' display='flex'>
                <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>Remarks Status:</Chakra.Text>
                <Chakra.Text fontSize='14px' fontWeight='400'>{userData?.remarksStatus}</Chakra.Text>
              </Chakra.Box>
              <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
            </Chakra.Box>

            <Chakra.Text mt='60px' fontSize='14px' fontWeight='700'>IDs</Chakra.Text>
            <Chakra.Box w='100%' h='2px' bg='gray.800'></Chakra.Box>

            <Chakra.Box w='100%' p='0 2% 0 2%'>
              <Chakra.Box w='100%' mt='10px' p='0 2% 0 2%' display='flex'>
                <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>TIN Number:</Chakra.Text>
                <Chakra.Text fontSize='14px' fontWeight='400'>{userData?.tinNumber}</Chakra.Text>
              </Chakra.Box>
              <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
              <Chakra.Box w='100%' mt='5px' p='0 2% 0 2%' display='flex'>
                <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>SSS Number:</Chakra.Text>
                <Chakra.Text fontSize='14px' fontWeight='400'>{userData?.sssNumber}</Chakra.Text>
              </Chakra.Box>
              <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
              <Chakra.Box w='100%' mt='5px' p='0 2% 0 2%' display='flex'>
                <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>PhilHealth Number:</Chakra.Text>
                <Chakra.Text fontSize='14px' fontWeight='400' textTransform='capitalize'>{userData?.philhealth}</Chakra.Text>
              </Chakra.Box>
              <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
              <Chakra.Box w='100%' mt='5px' p='0 2% 0 2%' display='flex'>
                <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>GSIS Number:</Chakra.Text>
                <Chakra.Text fontSize='14px' fontWeight='400'>{userData?.gsisNumber}</Chakra.Text>
              </Chakra.Box>
              <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
              <Chakra.Box w='100%' mt='5px' p='0 2% 0 2%' display='flex'>
                <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>Pag-ibig Number:</Chakra.Text>
                <Chakra.Text fontSize='14px' fontWeight='400'>{userData?.pagibigNumber}</Chakra.Text>
              </Chakra.Box>
              <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
              <Chakra.Box w='100%' mt='5px' p='0 2% 0 2%' display='flex'>
                <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>PRC Number:</Chakra.Text>
                <Chakra.Text fontSize='14px' fontWeight='400'>{`${userData?.prcNumber} (Expiration date: ${userData?.prcExpirationDate})`}</Chakra.Text>
              </Chakra.Box>
              <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
            </Chakra.Box>

            <Chakra.Text mt='60px' fontSize='14px' fontWeight='700'>OTHERS</Chakra.Text>
            <Chakra.Box w='100%' h='2px' bg='gray.800'></Chakra.Box>

            <Chakra.Box w='100%' p='0 2% 0 2%'>
              <Chakra.Box w='100%' mt='10px' p='0 2% 0 2%' display='flex'>
                <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>Adviser:</Chakra.Text>
                <Chakra.Text fontSize='14px' fontWeight='400' textTransform='capitalize'>{userData?.adviser}</Chakra.Text>
              </Chakra.Box>
              <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
              <Chakra.Box w='100%' mt='5px' p='0 2% 0 2%' display='flex'>
                <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>CS Eligibility:</Chakra.Text>
                <Chakra.Text fontSize='14px' fontWeight='400' textTransform='capitalize'>{userData?.csEligibility === 'Others' ? `${userData.otherEligibility}` : userData?.csEligibility}</Chakra.Text>
              </Chakra.Box>
              <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
              <Chakra.Box w='100%' mt='5px' p='0 2% 0 2%' display='flex'>
                <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>Educational Attainment:</Chakra.Text>
                <Chakra.Text fontSize='14px' fontWeight='400' textTransform='capitalize'>{userData?.educationalAttainment}</Chakra.Text>
              </Chakra.Box>
              <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
              <Chakra.Box w='100%' mt='5px' p='0 2% 0 2%' display='flex'>
                <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>Plantilla Item No. :</Chakra.Text>
                <Chakra.Text fontSize='14px' fontWeight='400'>{userData?.plantillaNo}</Chakra.Text>
              </Chakra.Box>
              <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
              <Chakra.Box w='100%' mt='5px' p='0 2% 0 2%' display='flex'>
                <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>First day of Service of Current Station:</Chakra.Text>
                <Chakra.Text fontSize='14px' fontWeight='400'>{new Date(userData?.firstDayOfServiceOfCurrentStation).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Chakra.Text>
              </Chakra.Box>
              <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
              <Chakra.Box w='100%' mt='5px' p='0 2% 0 2%' display='flex'>
                <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>Teaching Experience:</Chakra.Text>
                <Chakra.Text fontSize='14px' fontWeight='400'>{teachingExperience}</Chakra.Text>
              </Chakra.Box>
              <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
              <Chakra.Box w='100%' mt='5px' p='0 2% 0 2%' display='flex'>
                <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>Basic Salary:</Chakra.Text>
                <Chakra.Text fontSize='14px' fontWeight='400'>{userData?.basicSalary}</Chakra.Text>
              </Chakra.Box>
              <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
            </Chakra.Box>

            <Chakra.Text mt='60px' fontSize='14px' fontWeight='700'>TRAININGS</Chakra.Text>
            <Chakra.Box w='100%' h='2px' bg='gray.800'></Chakra.Box>

            {certificates.length === 0 ? (
              <Chakra.Box w='100%' mb='4.5%' p='0 2% 0 2%'>
                <Chakra.Box w='100%' mt='10px' p='0 2% 0 2%' display='flex'>
                  <Chakra.Text w='100%' fontSize='14px' color='gray.500' fontWeight='400' textTransform='capitalize' textAlign='center'>N/A</Chakra.Text>
                </Chakra.Box>
              </Chakra.Box>
            )
              :
              (
                certificates.map((certificate) => (
                  <Chakra.Box key={certificate.id} w='100%' mb='4.5%' p='0 2% 0 2%'>
                    <Chakra.Box w='100%' mt='10px' p='0 2% 0 2%' display='flex'>
                      <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>Title</Chakra.Text>
                      <Chakra.Text fontSize='14px' fontWeight='400' textTransform='capitalize'>{certificate.title}</Chakra.Text>
                    </Chakra.Box>
                    <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
                    <Chakra.Box w='100%' mt='5px' p='0 2% 0 2%' display='flex'>
                      <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>Venue:</Chakra.Text>
                      <Chakra.Text fontSize='14px' textTransform='capitalize'>{certificate.venue}</Chakra.Text>
                    </Chakra.Box>
                    <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
                    <Chakra.Box w='100%' mt='5px' p='0 2% 0 2%' display='flex'>
                      <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>Sponsoring Agency:</Chakra.Text>
                      <Chakra.Text fontSize='14px' textTransform='capitalize'>{certificate.sponsoringAgency}</Chakra.Text>
                    </Chakra.Box>
                    <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
                    <Chakra.Box w='100%' mt='5px' p='0 2% 0 2%' display='flex'>
                      <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>Date:</Chakra.Text>
                      <Chakra.Text fontSize='14px'>{new Date(certificate.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Chakra.Text>
                    </Chakra.Box>
                    <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
                  </Chakra.Box>
                ))
              )}
          </Chakra.Box>
        </Chakra.Box>
      </Chakra.Box>
    </Chakra.Box>
  )
}

