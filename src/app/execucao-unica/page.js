"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import IconButton from '@mui/material/IconButton';
import toast from 'react-hot-toast';
import StopIcon from '@mui/icons-material/Stop';
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormLabel,
  createTheme,
  ThemeProvider,
} from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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

export default function ExecucaoUnica() {
  const [titulo, setTitulo] = useState('');
  const [caminhoProjeto, setCaminhoProjeto] = useState('');
  const [categoria, setCategoria] = useState('');
  const [status, setStatus] = useState('ativo');
  const [tecnologia, setTecnologia] = useState('python'); 
  const [frequencia, setFrequencia] = useState('');
  const [parametros, setParametros] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(false);
  const [dataHoraInicio, setDataHoraInicio] = useState(new Date());

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensagem('');
    try {
      const dataHoraFormatada = dataHoraInicio ? format(dataHoraInicio, 'yyyy-MM-dd HH:mm:ss') : '';

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BACK_URL}/agendamentos`, {
        titulo,
        categoria,
        caminho_projeto: caminhoProjeto.replace(/"/g, ''),
        data_hora_inicio: dataHoraFormatada,
        frequencia,
        tecnologia, 
        parametros: parametros.split(',').map((param) => param.trim()),
        status,
      });

      setMensagem(`Execução criada com sucesso! Logs de saída:\n\n${response.data.logs_saida || "Execução sem saída registrada."}`);
      setTitulo('');
      setCaminhoProjeto('');
      setDataHoraInicio(new Date());
      setCategoria('');
      setTecnologia('python');
      setFrequencia('');
      setParametros('');
    } catch (error) {
      setMensagem(`Erro ao criar execução: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full p-10">
      <ThemeProvider theme={customTheme}>
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={ptBR}>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ width: '100%', maxWidth: '600px', p: 4, boxShadow: 3, bgcolor: 'background.paper' }}
          >
            <Typography variant="h4" textAlign="center" mb={3}>
              Criar Execução e Agendamento
            </Typography>

            <TextField
              label="Título"
              fullWidth
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              margin="normal"
              disabled={loading}
              sx={{ mb: 3 }}
            />

            <TextField
              label="Caminho Completo do Projeto"
              fullWidth
              value={caminhoProjeto}
              onChange={(e) => setCaminhoProjeto(e.target.value)}
              margin="normal"
              disabled={loading}
              sx={{ mb: 3 }}
            />

            <Box sx={{ my: 1 }}>
              <DateTimePicker
                label="Data e Hora de Início"
                value={dataHoraInicio}
                onChange={(newValue) => setDataHoraInicio(newValue)}
                ampm={false}
                inputFormat="dd/MM/yyyy HH:mm"
                renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
              />
            </Box>

            <FormControl fullWidth margin="normal">
              <InputLabel>Categoria</InputLabel>
              <Select value={categoria} onChange={(e) => setCategoria(e.target.value)} label="Categoria">
                <MenuItem value="Teste devs">Teste devs</MenuItem>
                <MenuItem value="Rotina diaria">Rotina diária</MenuItem>
                <MenuItem value="Rotina semanal">Rotina semanal</MenuItem>
                <MenuItem value="Rotina mensal">Rotina mensal</MenuItem>
                <MenuItem value="Operacional">Operacional</MenuItem>
                <MenuItem value="Risco">Risco</MenuItem>
              </Select>
            </FormControl>

            <FormControl component="fieldset" margin="normal">
              <FormLabel component="legend">Tecnologia</FormLabel>
              <RadioGroup row value={tecnologia} onChange={(e) => setTecnologia(e.target.value)}>
                <FormControlLabel value="python" control={<Radio />} label="Python" />
                <FormControlLabel value="node.js" control={<Radio />} label="Node.js" />
              </RadioGroup>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Frequência</InputLabel>
              <Select value={frequencia} onChange={(e) => setFrequencia(e.target.value)} label="Frequência">
                <MenuItem value="diaria">Diária</MenuItem>
                <MenuItem value="semanal">Semanal</MenuItem>
                <MenuItem value="mensal">Mensal</MenuItem>
                <MenuItem value="10">A cada 10 minutos</MenuItem>
                <MenuItem value="60">A cada 1 hora</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Parâmetros (separados por vírgula)"
              fullWidth
              value={parametros}
              onChange={(e) => setParametros(e.target.value)}
              margin="normal"
              disabled={loading}
            />

            <FormControl component="fieldset" margin="normal">
              <FormLabel component="legend">Status</FormLabel>
              <RadioGroup row value={status} onChange={(e) => setStatus(e.target.value)}>
                <FormControlLabel value="ativo" control={<Radio />} label="Ativo" />
                <FormControlLabel value="inativo" control={<Radio />} label="Inativo" />
              </RadioGroup>
            </FormControl>

            <Box display="flex" justifyContent="center" mt={3}>
              <Button type="submit" variant="contained" fullWidth disabled={loading}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Criar Execução'}
              </Button>
            </Box>

            {mensagem && (
              <Box mt={4} p={2} bgcolor="#272C3F" color="white" fontFamily="monospace" borderRadius={2}>
                {mensagem}
              </Box>
            )}
          </Box>
        </LocalizationProvider>
      </ThemeProvider>
    </div>
  );
}
