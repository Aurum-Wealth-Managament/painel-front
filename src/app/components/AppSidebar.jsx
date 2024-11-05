// components/AppSidebar.js
"use client"; // Garantir que é um client component

import React, { useState } from "react";
import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/assets/Logomarca_2x.png'; 
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import ptLocale from 'date-fns/locale/pt-BR';
import { Calendar } from "@/components/ui/calendar"


import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"; 

const AppSidebar = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [date, setDate] = React.useState(new Date());

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  return (
    <Sidebar className="bg-aurum-dark text-white h-screen w-64 transition-width duration-300">
      <SidebarHeader className="p-6 bg-aurum-dark text-white">
        <Link href="/">
          <Image src={Logo} alt="Logo Aurumwm" className="w-auto h-10" />
        </Link>
      </SidebarHeader>

      <SidebarContent className="bg-aurum-dark text-white p-4 justify-between">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/" className="text-2xl">
                Home
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/agendamentos" className="text-2xl">
                Agendamentos
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/execucao-unica" className="text-2xl">
                Criar Execução
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md bg-aurum-dark text-sm w-auto h-auto p-0"
        />

      </SidebarContent>

      <SidebarFooter className="bg-aurum-dark text-white p-6">
        {/* Adicione conteúdo do footer, se necessário */}
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;