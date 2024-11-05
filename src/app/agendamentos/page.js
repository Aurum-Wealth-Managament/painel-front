"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Link from "next/link";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import IconButton from '@mui/material/IconButton';
import TerminalIcon from '@mui/icons-material/Terminal';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl, Box
} from '@mui/material';
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

export default function Agendamentos() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [agendamentosFiltrados, setAgendamentosFiltrados] = useState([]);
  const [executando, setExecutando] = useState({});
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openLogsDialog, setOpenLogsDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAgendamento, setSelectedAgendamento] = useState(null);
  const [logs, setLogs] = useState([]);
  const [frequencia, setFrequencia] = useState('');
  const [tecnologia, setTecnologia] = useState('');
  const [proximaExecucao, setProximaExecucao] = useState('');
  const [loading, setLoading] = useState(true);
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroTitulo, setFiltroTitulo] = useState("");

  useEffect(() => {
    const fetchAgendamentos = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BACK_URL}/agendamentos`);
        setAgendamentos(response.data);
        setAgendamentosFiltrados(response.data);
      } catch (error) {
        toast.error('Erro ao buscar agendamentos');
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
        (filtroTitulo ? agendamento.titulo.toLowerCase().includes(filtroTitulo.toLowerCase()) : true)
      );
      setAgendamentosFiltrados(filtrados);
    };
    aplicarFiltros();
  }, [filtroCategoria, filtroTitulo, agendamentos]);

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

  const handleEdit = (agendamento) => {
    setSelectedAgendamento(agendamento);
    setFrequencia(agendamento.frequencia);
    setTecnologia(agendamento.tecnologia);
    setProximaExecucao(agendamento.proxima_execucao);
    setOpenEditDialog(true);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_BACK_URL}/agendamentos/${selectedAgendamento.id}`, {
        frequencia,
        tecnologia,
        proxima_execucao: proximaExecucao,
      });
      toast.success('Agendamento atualizado com sucesso!');
      setAgendamentos((prev) =>
        prev.map((ag) =>
          ag.id === selectedAgendamento.id ? { ...ag, frequencia, tecnologia, proxima_execucao: proximaExecucao } : ag
        )
      );
      setOpenEditDialog(false);
    } catch (error) {
      toast.error('Erro ao atualizar agendamento');
    }
  };

  const openDeleteDialog = (agendamento) => {
    setSelectedAgendamento(agendamento);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_BACK_URL}/agendamentos/${selectedAgendamento.id}`);
      toast.success('Agendamento excluído com sucesso!');
      setAgendamentos((prev) => prev.filter((ag) => ag.id !== selectedAgendamento.id));
      setDeleteDialogOpen(false);
    } catch (error) {
      toast.error('Erro ao excluir agendamento');
    }
  };

  const handleViewLogs = async (agendamento) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BACK_URL}/agendamentos/${agendamento.id}/logs`);
      setLogs(response.data);
      setOpenLogsDialog(true);
    } catch (error) {
      toast.error('Erro ao buscar logs');
    }
  };

  return (
    <div className="flex flex-col items-center w-full p-10">
      <div className="flex justify-between items-center mb-8 mt-4 w-full">
        <h1 className="text-3xl font-bold">Acompanhe os agendamentos</h1>
        <Link href="/execucao-unica" className="p-4 bg-aurum-dark text-white rounded-md hover:bg-slate-400 hover:text-white">
          Adicionar Execução
        </Link>
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
            label="Buscar por Título"
            variant="outlined"
            fullWidth
            value={filtroTitulo}
            onChange={(e) => setFiltroTitulo(e.target.value)}
          />
        </Box>
      </ThemeProvider>

      {loading ? (
        <div className="p-6 text-center text-gray-500">Carregando agendamentos...</div>
      ) : (
        <Table>
          <TableCaption>Fim dos agendamentos!</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="bg-aurum-dark text-white">Executar</TableHead>
              <TableHead className="bg-aurum-dark text-white">ID</TableHead>
              <TableHead className="bg-aurum-dark text-white">Título</TableHead>
              <TableHead className="bg-aurum-dark text-white">Categoria</TableHead>
              <TableHead className="bg-aurum-dark text-white">Projeto</TableHead>
              <TableHead className="bg-aurum-dark text-white">Última execução</TableHead>
              <TableHead className="bg-aurum-dark text-white">Frequência</TableHead>
              <TableHead className="bg-aurum-dark text-white">Próxima Execução</TableHead>
              <TableHead className="bg-aurum-dark text-white">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white">
            {agendamentosFiltrados.map((agendamento) => (
              <TableRow key={agendamento.id}>
                <TableCell>
                  <IconButton onClick={() => handleToggleExecute(agendamento.id)} sx={{ color: '#272C3F' }}>
                    {executando[agendamento.id] ? <StopIcon /> : <PlayArrowIcon />}
                  </IconButton>
                </TableCell>
                <TableCell>{agendamento.id}</TableCell>
                <TableCell>{agendamento.titulo}</TableCell>
                <TableCell>{agendamento.categoria}</TableCell>
                <TableCell>{agendamento.caminho_projeto}</TableCell>
                <TableCell>{agendamento.ultima_execucao}</TableCell>
                <TableCell>{agendamento.frequencia}</TableCell>
                <TableCell>{agendamento.proxima_execucao}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(agendamento)} sx={{ color: '#272C3F' }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => openDeleteDialog(agendamento)} sx={{ color: '#272C3F' }}>
                    <DeleteIcon />
                  </IconButton>
                  <IconButton onClick={() => handleViewLogs(agendamento)} sx={{ color: '#272C3F' }}>
                    <TerminalIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Diálogo de edição */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Editar Agendamento</DialogTitle>
        <DialogContent>
          <Select
            label="Frequência"
            fullWidth
            value={frequencia}
            onChange={(e) => setFrequencia(e.target.value)}
          >
            <MenuItem value="diaria">Diária</MenuItem>
            <MenuItem value="semanal">Semanal</MenuItem>
            <MenuItem value="mensal">Mensal</MenuItem>
            <MenuItem value="15">A cada 15 minutos</MenuItem>
            <MenuItem value="30">A cada 30 minutos</MenuItem>
            <MenuItem value="60">A cada 60 minutos</MenuItem>
          </Select>

          <TextField
            margin="dense"
            label="Tecnologia"
            type="text"
            fullWidth
            value={tecnologia}
            onChange={(e) => setTecnologia(e.target.value)}
          />

          <TextField
            margin="dense"
            label="Próxima Execução"
            type="datetime-local"
            fullWidth
            value={proximaExecucao}
            onChange={(e) => setProximaExecucao(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleUpdate} color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de Logs */}
      <Dialog open={openLogsDialog} onClose={() => setOpenLogsDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Logs de Execução</DialogTitle>
        <DialogContent>
          {logs.length > 0 ? (
            logs.map((log, index) => (
              <div key={index} className="border-b border-gray-300 mb-4 pb-4">
                <p><strong>Data/Hora de Execução:</strong> {log.data_hora_execucao}</p>
                <p><strong>Saída:</strong> {log.log_saida || 'Nenhuma saída disponível'}</p>
                <p><strong>Erro:</strong> {log.log_erro || 'Nenhum erro registrado'}</p>
                <p><strong>Usuário de Execução:</strong> {log.usuario_execucao}</p>
              </div>
            ))
          ) : (
            <DialogContentText>Nenhum log encontrado para este agendamento.</DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLogsDialog(false)} color="inherit">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de confirmação de exclusão */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>Deseja realmente excluir este agendamento?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="secondary">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
