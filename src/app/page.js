"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import IconButton from '@mui/material/IconButton';
import toast from 'react-hot-toast';
import StopIcon from '@mui/icons-material/Stop';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { TextField, FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";

const customTheme = createTheme({
  palette: {
    primary: { main: '#DBC288' },
    text: { primary: '#272C3F' },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& fieldset': {
            borderColor: '#272C3F',
            borderWidth: '1px',
          },
          '&:hover fieldset': {
            borderColor: '#DBC288',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#DBC288',
          },
        },
      },
    },
  },
});

export default function Home() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [executando, setExecutando] = useState({});
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroTexto, setFiltroTexto] = useState("");
  const [agendamentosFiltrados, setAgendamentosFiltrados] = useState([]);

  useEffect(() => {
    const fetchAgendamentos = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BACK_URL}/agendamentos`);
        setAgendamentos(response.data.slice(0, 20));
        setAgendamentosFiltrados(response.data.slice(0, 20)); // Inicia com todos os agendamentos
      } catch (error) {
        console.error("Erro ao buscar agendamentos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAgendamentos();
  }, []);

  useEffect(() => {
    const aplicarFiltros = () => {
      const filtrados = agendamentos.filter((agendamento) =>
        (filtroCategoria ? agendamento.categoria === filtroCategoria : true) &&
        (filtroTexto ? (
          agendamento.titulo.toLowerCase().includes(filtroTexto.toLowerCase()) || 
          (agendamento.proxima_execucao && agendamento.proxima_execucao.includes(filtroTexto))
        ) : true)
      );
      setAgendamentosFiltrados(filtrados);
    };
    aplicarFiltros();
  }, [filtroCategoria, filtroTexto, agendamentos]);

  const handleToggleExecute = async (id) => {
    try {
      if (executando[id]) {
        await axios.post(`${process.env.NEXT_PUBLIC_API_BACK_URL}/stop-executar-agora/${id}`);
        toast.success(`Execução da tarefa ID ${id} parada com sucesso!`);
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_BACK_URL}/executar-agora/${id}`);
        toast.success(`Tarefa ID ${id} executada com sucesso!`);
      }
      setExecutando((prev) => ({ ...prev, [id]: !prev[id] }));
    } catch (error) {
      toast.error('Erro ao alternar a execução da tarefa.');
    }
  };

  return (
    <div className="flex flex-col items-center w-full p-10">
      <div className="flex justify-between items-center mb-8 mt-4 w-full">
        <h1 className="text-3xl font-bold">Lista de agendamentos</h1>
        <div className="space-x-4">
          <Link href="/execucao-unica" className="p-4 bg-aurum-gold text-aurum-dark rounded-md">
            Adicionar Execução
          </Link>
          <Link href="/agendamentos" className="p-4 bg-aurum-dark text-aurum-gold rounded-md">
            Ver Lista Completa
          </Link>
        </div>
      </div>

      <ThemeProvider theme={customTheme}>
        <Box className="flex flex-col sm:flex-row items-center gap-4 w-full mb-8">
          <FormControl fullWidth variant="outlined">
            <InputLabel>Filtrar por Categoria</InputLabel>
            <Select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              label="Filtrar por Categoria"
            >
              <MenuItem value="">Todas</MenuItem>
              <MenuItem value="Teste devs">Teste devs</MenuItem>
              <MenuItem value="Rotina diaria">Rotina diária</MenuItem>
              <MenuItem value="Rotina semanal">Rotina semanal</MenuItem>
              <MenuItem value="Rotina mensal">Rotina mensal</MenuItem>
              <MenuItem value="Operacional">Operacional</MenuItem>
              <MenuItem value="Risco">Risco</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Buscar por Título ou Próxima Execução"
            variant="outlined"
            fullWidth
            value={filtroTexto}
            onChange={(e) => setFiltroTexto(e.target.value)}
          />
        </Box>
      </ThemeProvider>

      <div className="flex justify-between items-center mb-8 mt-4 w-full">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Carregando agendamentos...</div>
        ) : (
          <Table>
            <TableCaption>Fim dos agendamentos!</TableCaption>
            <TableHeader>
              <TableRow className="bg-aurum-dark text-white">
                <TableHead className="text-white">ID</TableHead>
                <TableHead className="text-white">Título</TableHead>
                <TableHead className="text-white">Categoria</TableHead>
                <TableHead className="text-white">Projeto</TableHead>
                <TableHead className="text-white">Tecnologia</TableHead>
                <TableHead className="text-white">Última execução</TableHead>
                <TableHead className="text-white">Frequência</TableHead>
                <TableHead className="text-white">Próxima Execução</TableHead>
                <TableHead className="text-white">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white">
              {agendamentosFiltrados.length > 0 ? (
                agendamentosFiltrados.map((agendamento) => (
                  <TableRow key={agendamento.id}>
                    <TableCell>{agendamento.id}</TableCell>
                    <TableCell>{agendamento.titulo}</TableCell>
                    <TableCell>{agendamento.categoria}</TableCell>
                    <TableCell>{agendamento.caminho_projeto}</TableCell>
                    <TableCell>{agendamento.tecnologia}</TableCell>
                    <TableCell>{agendamento.ultima_execucao}</TableCell>
                    <TableCell>{agendamento.frequencia}</TableCell>
                    <TableCell>{agendamento.proxima_execucao}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleToggleExecute(agendamento.id)} sx={{ color: '#272C3F' }}>
                        {executando[agendamento.id] ? <StopIcon /> : <PlayArrowIcon />}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="9" className="text-center">
                    Nenhum agendamento disponível com os filtros aplicados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
