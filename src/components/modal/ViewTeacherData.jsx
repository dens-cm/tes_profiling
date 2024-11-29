/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react'
import dayjs from 'dayjs'
import * as Chakra from '@chakra-ui/react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { MaterialReactTable } from 'material-react-table'
import { HiPhone, HiMiniMapPin, HiEnvelope } from "react-icons/hi2"
import { SmallCloseIcon } from '@chakra-ui/icons'
import { TiUser } from "react-icons/ti"
import { BiPrinter } from "react-icons/bi"
import useFetchCertificates from '../../hooks/data/userCertificates'

export default function ViewTeacherData({ isOpen, onClose, user }) {

    const [teachingExperience, setTeachingExperience] = React.useState('')
    const { certificates, loadingCertificates } = useFetchCertificates(user?.id)

    React.useEffect(() => {
        const calculateExperience = () => {
            if (user?.firstDayOfService) {
                const firstDay = dayjs(user.firstDayOfService)
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
    }, [user])

    const columns = React.useMemo(
        () => [
            {
                accessorKey: 'title',
                header: 'Title',
                size: 10,
                Cell: ({ cell }) => (
                    <Chakra.Text textTransform="capitalize">{cell.getValue()}</Chakra.Text>
                )
            },
            {
                accessorKey: 'venue',
                header: 'Venue',
                size: 7,
                Cell: ({ cell }) => (
                    <Chakra.Text textTransform="capitalize">{cell.getValue()}</Chakra.Text>
                )
            },
            {
                accessorKey: 'sponsoringAgency',
                header: 'Sponsoring Agency',
                size: 7,
                Cell: ({ cell }) => (
                    <Chakra.Text textTransform="capitalize">{cell.getValue()}</Chakra.Text>
                )
            },
            {
                accessorKey: 'date',
                header: 'Date',
                size: 5,
                Cell: ({ cell }) => (
                    <Chakra.Text>{new Date(cell.getValue()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Chakra.Text>
                )
            },
        ],
        []
    )

    const theme = createTheme({
        shadows: ["none"]
    })

    return (
        <Chakra.Modal isOpen={isOpen} onClose={onClose} size='full'>
            <Chakra.ModalContent w='100%' h='100%' bg='gray.100'>
                <Chakra.ModalHeader zIndex='1' w='100%' bg='white' display='flex' alignItems='center' justifyContent='space-between' boxShadow='.1vw .1vw .3vw rgba(105, 126, 116, .1)'>
                    <Chakra.Box w='33%'>
                        <Chakra.Text fontSize='1vw' fontWeight='bold' color='gray.700' display='flex' alignItems='center'> <Chakra.Text mr='1%' fontSize='1.3vw'><TiUser /></Chakra.Text> Teacher Data</Chakra.Text>
                    </Chakra.Box>
                    <Chakra.Box w='33%' display='flex' justifyContent='center'>
                        <Chakra.Button h='1.8vw' fontSize='.8vw' colorScheme='teal' leftIcon={<BiPrinter />} borderRadius='0'>Print</Chakra.Button>
                    </Chakra.Box>
                    <Chakra.Box w='33%' display='flex' justifyContent='right'>
                        <Chakra.IconButton onClick={onClose} w='1vw' h='2vw' fontSize='1vw' bg='#0000' icon={<SmallCloseIcon />} borderRadius='0' />
                    </Chakra.Box>
                </Chakra.ModalHeader>
                <Chakra.ModalBody w='100%' h='100%' p='1% 2% 2% 2%' display='flex' overflow='auto' scrollBehavior='smooth'>
                    <Chakra.Box w='100%' display='flex' alignItems='flex-start' justifyContent='center'>
                        <Chakra.Box w='45%' p='3%' bg='white' display='flex' flexDirection='column' borderRadius='0'>
                            <Chakra.Box w='100%' p='2%' bg='gray.100' borderRadius='0'>
                                <Chakra.Box mb='3%' display='flex'>
                                    <Chakra.Image src={user?.profileImageUrl} w='6vw' h='6vw' borderRadius='0' />
                                    <Chakra.Box ml='2%'>
                                        <Chakra.Text fontSize='1.5vw' fontWeight='700' textTransform='capitalize'>{`${user?.firstName} ${user?.middleName} ${user?.lastName} ${user?.extensionName}`}</Chakra.Text>
                                        <Chakra.Text fontSize='1.2vw' fontWeight='400' textTransform='capitalize'>{`${user?.adviser}`}</Chakra.Text>
                                    </Chakra.Box>
                                </Chakra.Box>
                                <hr />
                                <Chakra.Box mt='2%' ml='1%' mb='1%'>
                                    <Chakra.Text fontSize='.9vw' fontWeight='400' display='flex' alignItems='center' textTransform='capitalize'><Chakra.Text mr='.7%'><HiPhone /></Chakra.Text>{`: ${user?.contactNumber}`}</Chakra.Text>
                                    <Chakra.Text fontSize='.9vw' fontWeight='400' display='flex' alignItems='center' textTransform='capitalize'><Chakra.Text mr='.7%'><HiMiniMapPin /></Chakra.Text>{`: ${user?.address}`}</Chakra.Text>
                                    <Chakra.Text fontSize='.9vw' fontWeight='400' display='flex' alignItems='center'><Chakra.Text mr='.7%'><HiEnvelope /></Chakra.Text>{`: ${user?.emailAddress}`}</Chakra.Text>
                                </Chakra.Box>
                            </Chakra.Box>

                            <Chakra.Box mt='3%' p='2%'>
                                <Chakra.Text fontSize='1vw' fontWeight='700'>PERSONAL INFORMATION</Chakra.Text>
                                <Chakra.Box h='.1vw' bg='gray.500'></Chakra.Box>

                                <Chakra.Box w='100%' p='2%'>
                                    <Chakra.Box w='100%' display='flex'>
                                        <Chakra.Text w='47%' fontSize='.9vw' fontWeight='500'>Age:</Chakra.Text>
                                        <Chakra.Text w='53%' fontSize='.9vw' fontWeight='400'>{user?.age}</Chakra.Text>
                                    </Chakra.Box>
                                    <hr />
                                    <Chakra.Box w='100%' mt='1%' display='flex'>
                                        <Chakra.Text w='47%' fontSize='.9vw' fontWeight='500'>Birthdate:</Chakra.Text>
                                        <Chakra.Text w='53%' fontSize='.9vw' fontWeight='400'>{new Date(user?.birthdate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Chakra.Text>
                                    </Chakra.Box>
                                    <hr />
                                    <Chakra.Box w='100%' mt='1%' display='flex'>
                                        <Chakra.Text w='47%' fontSize='.9vw' fontWeight='500'>Birthplace:</Chakra.Text>
                                        <Chakra.Text w='53%' fontSize='.9vw' fontWeight='400' textTransform='capitalize'>{user?.birthplace}</Chakra.Text>
                                    </Chakra.Box>
                                    <hr />
                                    <Chakra.Box w='100%' mt='1%' display='flex'>
                                        <Chakra.Text w='47%' fontSize='.9vw' fontWeight='500'>Gender:</Chakra.Text>
                                        <Chakra.Text w='53%' fontSize='.9vw' fontWeight='400'>{user?.gender}</Chakra.Text>
                                    </Chakra.Box>
                                    <hr />
                                    <Chakra.Box w='100%' mt='1%' display='flex'>
                                        <Chakra.Text w='47%' fontSize='.9vw' fontWeight='500'>Civil Status:</Chakra.Text>
                                        <Chakra.Text w='53%' fontSize='.9vw' fontWeight='400'>{user?.civilStatus}</Chakra.Text>
                                    </Chakra.Box>
                                    <hr />
                                    <Chakra.Box w='100%' mt='1%' display='flex'>
                                        <Chakra.Text w='47%' fontSize='.9vw' fontWeight='500'>Citizenship:</Chakra.Text>
                                        <Chakra.Text w='53%' fontSize='.9vw' fontWeight='400'>{user?.citizenship}</Chakra.Text>
                                    </Chakra.Box>
                                    <hr />
                                </Chakra.Box>
                            </Chakra.Box>

                            <Chakra.Box mt='.1%' p='2%'>
                                <Chakra.Text fontSize='1vw' fontWeight='700'>JOB INFORMATION</Chakra.Text>
                                <Chakra.Box h='.1vw' bg='gray.500'></Chakra.Box>

                                <Chakra.Box w='100%' p='2%'>
                                    <Chakra.Box w='100%' display='flex'>
                                        <Chakra.Text w='47%' fontSize='.9vw' fontWeight='500'>Ehris No. :</Chakra.Text>
                                        <Chakra.Text w='53%' fontSize='.9vw' fontWeight='400' textTransform='capitalize'>{user?.ehrisNumber}</Chakra.Text>
                                    </Chakra.Box>
                                    <hr />
                                    <Chakra.Box w='100%' mt='1%' display='flex'>
                                        <Chakra.Text w='47%' fontSize='.9vw' fontWeight='500'>employee ID:</Chakra.Text>
                                        <Chakra.Text w='53%' fontSize='.9vw' fontWeight='400'>{user?.employeeId}</Chakra.Text>
                                    </Chakra.Box>
                                    <hr />
                                    <Chakra.Box w='100%' mt='1%' display='flex'>
                                        <Chakra.Text w='47%' fontSize='.9vw' fontWeight='500'>Position:</Chakra.Text>
                                        <Chakra.Text w='53%' fontSize='.9vw' fontWeight='400' textTransform='capitalize'>{user?.position}</Chakra.Text>
                                    </Chakra.Box>
                                    <hr />
                                    <Chakra.Box w='100%' mt='1%' display='flex'>
                                        <Chakra.Text w='47%' fontSize='.9vw' fontWeight='500'>Active:</Chakra.Text>
                                        <Chakra.Text w='53%' fontSize='.9vw' fontWeight='400' textTransform='capitalize'>{user?.active}</Chakra.Text>
                                    </Chakra.Box>
                                    <hr />
                                    <Chakra.Box w='100%' mt='1%' display='flex'>
                                        <Chakra.Text w='47%' fontSize='.9vw' fontWeight='500'>Application Status:</Chakra.Text>
                                        <Chakra.Text w='53%' fontSize='.9vw' fontWeight='400' textTransform='capitalize'>{user?.applicationStatus}</Chakra.Text>
                                    </Chakra.Box>
                                    <hr />
                                    <Chakra.Box w='100%' mt='1%' display='flex'>
                                        <Chakra.Text w='47%' fontSize='.9vw' fontWeight='500'>Status of Employment:</Chakra.Text>
                                        <Chakra.Text w='53%' fontSize='.9vw' fontWeight='400' textTransform='capitalize'>{user?.statusOfEmployment}</Chakra.Text>
                                    </Chakra.Box>
                                    <hr />
                                    <Chakra.Box w='100%' mt='1%' display='flex'>
                                        <Chakra.Text w='47%' fontSize='.9vw' fontWeight='500'>Item Number:</Chakra.Text>
                                        <Chakra.Text w='53%' fontSize='.9vw' fontWeight='400'>{user?.itemNumber}</Chakra.Text>
                                    </Chakra.Box>
                                    <hr />
                                    <Chakra.Box w='100%' mt='1%' display='flex'>
                                        <Chakra.Text w='47%' fontSize='.9vw' fontWeight='500'>Old Item Number:</Chakra.Text>
                                        <Chakra.Text w='53%' fontSize='.9vw' fontWeight='400'>{user?.oldItemNumber}</Chakra.Text>
                                    </Chakra.Box>
                                    <hr />
                                    <Chakra.Box w='100%' mt='1%' display='flex'>
                                        <Chakra.Text w='47%' fontSize='.9vw' fontWeight='500'>Original Date as Permanent:</Chakra.Text>
                                        <Chakra.Text w='53%' fontSize='.9vw' fontWeight='400'>{new Date(user?.originalDateAsPermanent).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Chakra.Text>
                                    </Chakra.Box>
                                    <hr />
                                    <Chakra.Box w='100%' mt='1%' display='flex'>
                                        <Chakra.Text w='47%' fontSize='.9vw' fontWeight='500'>Date of original Applointment:</Chakra.Text>
                                        <Chakra.Text w='53%' fontSize='.9vw' fontWeight='400'>{new Date(user?.dateOfOriginalAppointment).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Chakra.Text>
                                    </Chakra.Box>
                                    <hr />
                                    <Chakra.Box w='100%' mt='1%' display='flex'>
                                        <Chakra.Text w='47%' fontSize='.9vw' fontWeight='500'>Date of Last Promotion:</Chakra.Text>
                                        <Chakra.Text w='53%' fontSize='.9vw' fontWeight='400'>{new Date(user?.dateOfLastPromotion).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Chakra.Text>
                                    </Chakra.Box>
                                    <hr />
                                    <Chakra.Box w='100%' mt='1%' display='flex'>
                                        <Chakra.Text w='47%' fontSize='.9vw' fontWeight='500'>Remarks Status:</Chakra.Text>
                                        <Chakra.Text w='53%' fontSize='.9vw' fontWeight='400' textTransform='capitalize'>{user?.remarksStatus}</Chakra.Text>
                                    </Chakra.Box>
                                    <hr />
                                </Chakra.Box>
                            </Chakra.Box>

                            <Chakra.Box mt='.1%' p='2%'>
                                <Chakra.Text fontSize='1vw' fontWeight='700'>IDs</Chakra.Text>
                                <Chakra.Box h='.1vw' bg='gray.500'></Chakra.Box>

                                <Chakra.Box w='100%' p='2%'>
                                    <Chakra.Box w='100%' display='flex'>
                                        <Chakra.Text w='47%' fontSize='.9vw' fontWeight='500'>TIN Number:</Chakra.Text>
                                        <Chakra.Text w='53%' fontSize='.9vw' fontWeight='400'>{user?.tinNumber}</Chakra.Text>
                                    </Chakra.Box>
                                    <hr />
                                    <Chakra.Box w='100%' mt='1%' display='flex'>
                                        <Chakra.Text w='47%' fontSize='.9vw' fontWeight='500'>SSS Number:</Chakra.Text>
                                        <Chakra.Text w='53%' fontSize='.9vw' fontWeight='400'>{user?.sssNumber}</Chakra.Text>
                                    </Chakra.Box>
                                    <hr />
                                    <Chakra.Box w='100%' mt='1%' display='flex'>
                                        <Chakra.Text w='47%' fontSize='.9vw' fontWeight='500'>PhilHealth Number:</Chakra.Text>
                                        <Chakra.Text w='53%' fontSize='.9vw' fontWeight='400' textTransform='capitalize'>{user?.philhealth}</Chakra.Text>
                                    </Chakra.Box>
                                    <hr />
                                    <Chakra.Box w='100%' mt='1%' display='flex'>
                                        <Chakra.Text w='47%' fontSize='.9vw' fontWeight='500'>GSIS Number:</Chakra.Text>
                                        <Chakra.Text w='53%' fontSize='.9vw' fontWeight='400'>{user?.gsisNumber}</Chakra.Text>
                                    </Chakra.Box>
                                    <hr />
                                    <Chakra.Box w='100%' mt='1%' display='flex'>
                                        <Chakra.Text w='47%' fontSize='.9vw' fontWeight='500'>Pag-ibig Number:</Chakra.Text>
                                        <Chakra.Text w='53%' fontSize='.9vw' fontWeight='400' textTransform='capitalize'>{user?.pagibigNumber}</Chakra.Text>
                                    </Chakra.Box>
                                    <hr />
                                    <Chakra.Box w='100%' mt='1%' display='flex'>
                                        <Chakra.Text w='47%' fontSize='.9vw' fontWeight='500'>PRC Number:</Chakra.Text>
                                        <Chakra.Text w='53%' fontSize='.9vw' fontWeight='400' textTransform='capitalize'>{`${user?.prcNumber} (Expiratopn date: ${user?.prcExpirationDate})`}</Chakra.Text>
                                    </Chakra.Box>
                                    <hr />
                                </Chakra.Box>
                            </Chakra.Box>

                            <Chakra.Box mt='.1%' p='2%'>
                                <Chakra.Text fontSize='1vw' fontWeight='700'>OTHERS</Chakra.Text>
                                <Chakra.Box h='.1vw' bg='gray.500'></Chakra.Box>

                                <Chakra.Box w='100%' p='2%'>
                                    <Chakra.Box w='100%' display='flex'>
                                        <Chakra.Text w='47%' fontSize='.9vw' fontWeight='500'>Adviser:</Chakra.Text>
                                        <Chakra.Text w='53%' fontSize='.9vw' fontWeight='400' textTransform='capitalize'>{user?.adviser}</Chakra.Text>
                                    </Chakra.Box>
                                    <hr />
                                    <Chakra.Box w='100%' mt='1%' display='flex'>
                                        <Chakra.Text w='47%' fontSize='.9vw' fontWeight='500'>CS Eligibility:</Chakra.Text>
                                        <Chakra.Text w='53%' fontSize='.9vw' fontWeight='400' textTransform='capitalize'>{user?.csEligibility}</Chakra.Text>
                                    </Chakra.Box>
                                    <hr />
                                    <Chakra.Box w='100%' mt='1%' display='flex'>
                                        <Chakra.Text w='47%' fontSize='.9vw' fontWeight='500'>Educational Attainment:</Chakra.Text>
                                        <Chakra.Text w='53%' fontSize='.9vw' fontWeight='400' textTransform='capitalize'>{user?.educationalAttainment}</Chakra.Text>
                                    </Chakra.Box>
                                    <hr />
                                    <Chakra.Box w='100%' mt='1%' display='flex'>
                                        <Chakra.Text w='47%' fontSize='.9vw' fontWeight='500'>Plantilla Item No. :</Chakra.Text>
                                        <Chakra.Text w='53%' fontSize='.9vw' fontWeight='400'>{user?.plantillaItemNo}</Chakra.Text>
                                    </Chakra.Box>
                                    <hr />
                                    <Chakra.Box w='100%' mt='1%' display='flex'>
                                        <Chakra.Text w='47%' fontSize='.9vw' fontWeight='500'>First day of Service of Current Status:</Chakra.Text>
                                        <Chakra.Text w='53%' fontSize='.9vw' fontWeight='400' textTransform='capitalize'>{new Date(user?.firstDayOfService).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Chakra.Text>
                                    </Chakra.Box>
                                    <hr />
                                    <Chakra.Box w='100%' mt='1%' display='flex'>
                                        <Chakra.Text w='47%' fontSize='.9vw' fontWeight='500'>Teaching Experience:</Chakra.Text>
                                        <Chakra.Text w='53%' fontSize='.9vw' fontWeight='400' textTransform='capitalize'>{teachingExperience}</Chakra.Text>
                                    </Chakra.Box>
                                    <hr />
                                    <Chakra.Box w='100%' mt='1%' display='flex'>
                                        <Chakra.Text w='47%' fontSize='.9vw' fontWeight='500'>Basic Salary:</Chakra.Text>
                                        <Chakra.Text w='53%' fontSize='.9vw' fontWeight='400' textTransform='capitalize'>{user?.basicSalary}</Chakra.Text>
                                    </Chakra.Box>
                                    <hr />
                                </Chakra.Box>
                            </Chakra.Box>

                        </Chakra.Box>

                        <Chakra.Box w='55%' p='0% 2% 2% 2%'>
                            <Chakra.Box w='100%' p='5%' bg='white' borderRadius='0'>
                                <Chakra.Box display='flex' alignItems='center' justifyContent='space-between'>
                                    <Chakra.Text fontSize='1.2vw' fontWeight='bold'>Trainings</Chakra.Text>

                                    <Chakra.Box display='flex'>
                                        <Chakra.Button mr='2%' h='1.6vw' fontSize='.9vw' bg='teal' color='white' borderRadius='.5vw' _hover={{ border: '.1vw solid teal', bg: 'white', color: 'teal' }}>export data</Chakra.Button>
                                        <Chakra.Button mr='2%' h='1.6vw' fontSize='.9vw' bg='purple' color='white' borderRadius='.5vw' _hover={{ border: '.1vw solid purple', bg: 'white', color: 'purple' }}>save as pdf</Chakra.Button>
                                        <Chakra.Button h='1.6vw' fontSize='.9vw' colorScheme='blue' borderRadius='.5vw' _hover={{ border: '.1vw solid blue', bg: 'white', color: 'blue' }}>print table</Chakra.Button>
                                    </Chakra.Box>
                                </Chakra.Box>
                                <Chakra.Text mb='1%' fontSize='.8vw' fontStyle='italic' color='gray.500'>Click on a certificate to view its details</Chakra.Text>
                                <hr />
                                <ThemeProvider theme={theme}>
                                    <MaterialReactTable
                                        columns={columns}
                                        data={certificates}
                                        muiTableHeadCellProps={{ sx: { fontSize: '.8vw' } }}
                                        muiTableBodyCellProps={{ sx: { fontSize: '.8vw', cursor: 'pointer' } }}
                                        enablePagination={false}
                                        enableStickyFooter={true}
                                        enableColumnFilters={true}
                                        initialState={{ density: 'compact' }}
                                        // muiTableBodyRowProps={({ row }) => ({
                                        //     onClick: () => handleRowClick(row)
                                        // })}
                                    />
                                </ThemeProvider>
                            </Chakra.Box>
                        </Chakra.Box>
                    </Chakra.Box>
                </Chakra.ModalBody>
            </Chakra.ModalContent>
        </Chakra.Modal>
    )
}
