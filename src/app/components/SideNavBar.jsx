"use client"
import Link from 'next/link';
import Logo from '@/assets/Logomarca_2x.png';
import Image from 'next/image';
import { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import ptLocale from 'date-fns/locale/pt-BR';
import dayjs from 'dayjs';

const SideNavBar = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  return (
    <aside className=" bg-primary text-white h-[100%]">
      <div className="p-6">
        <div className="text-2xl font-bold mt-10 mb-20">
          <Link href="/">
            <Image src={Logo} alt="Logo Aurumwm" className="w-auto h-[10vh]" />
          </Link>
        </div>

        <ul className="mt-2 space-y-4">
          <li>
            <Link href="/" className="hover:text-secondary text-2xl p-2">
              Home
            </Link>
          </li>
          <li>
            <Link href="/agendamentos" className="hover:text-secondary text-2xl p-2">
              Agendamentos
            </Link>
          </li>
          <li>
            <Link href="/execucao-unica" className="hover:text-secondary text-2xl p-2">
              Criar Execução
            </Link>
          </li>
        </ul>

        <div className="text-white mt-20 w-[17vw] p-0 flex items-center justify-center">
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={ptLocale}>
            <DateCalendar
              value={selectedDate}
              onChange={handleDateChange}
              sx={{
                '& .MuiPickersDay-root': {
                  borderRadius: '50%',
                  color: '#fff', 
                  width: '40px',
                  '&.Mui-selected': {
                    backgroundColor: '#DBC288', 
                    color: '#272C3F',
                  },
                },
                '& .MuiPickersCalendarHeader-label': {
                  fontSize: '14px',
                  color: '#fff', 
                },
                '& .MuiPickersArrowSwitcher-button': {
                  color: '#fff', 
                },
                '& .MuiIconButton-root': {
                  color: '#fff', 
                },
                '& .MuiTypography-root': {
                  color: '#fff', 
                },
              }}
            />
          </LocalizationProvider>
        </div>



      </div>
    </aside>
  );
};

export default SideNavBar;
