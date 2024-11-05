"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { CircularProgress, Box, Typography } from '@mui/material';

export default function AgendamentoLogs({ params }) {
  const { id } = params; // Obter o ID diretamente dos parâmetros
  const [agendamento, setAgendamento] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchAgendamento(id);
      fetchLogs(id);
    }
  }, [id]);

  const fetchAgendamento = async (id) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BACK_URL}/agendamentos/${id}`);
      setAgendamento(response.data);
    } catch (error) {
      console.error('Erro ao buscar detalhes do agendamento:', error);
    }
  };

  const fetchLogs = async (id) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BACK_URL}/logs/${id}`);
      setLogs(response.data);
      setLoading(false); 
    } catch (error) {
      console.error('Erro ao buscar logs do agendamento:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-start text-white mt-0 ">
      <Box sx={{ maxWidth: '90vw', height: '80vh', margin: '0 auto', padding: '2rem', borderRadius: '10px', bgcolor: '#272C3F' }}>
        <Typography variant="h4" component="h2" mb={3}>
          Detalhes do Agendamento ID: {id}
        </Typography>

        {/* Detalhes do Agendamento */}
        {agendamento && (
          <Box mb={4}>
            <Typography><strong>Caminho do Projeto:</strong> {agendamento.caminho_projeto}</Typography>
            <Typography><strong>Data de Início:</strong> {agendamento.data_hora_inicio}</Typography>
            <Typography><strong>Frequência:</strong> {agendamento.frequencia}</Typography>
            <Typography><strong>Tecnologia:</strong> {agendamento.tecnologia}</Typography>
          </Box>
        )}

        {/* Logs do Agendamento */}
        <Typography variant="h5" component="h3" mb={2}>
          Logs do Terminal
        </Typography>

        <Box sx={{ bgcolor: 'black', color: 'green', padding: '20px', borderRadius: '8px', height: '54vh', overflowY: 'scroll' }}>
          {logs.length > 0 ? (
            logs.map((log, index) => (
              <Box key={index} mb={2}>
                <Typography>
                  <span style={{ color: 'gray' }}>{new Date(log.timestamp).toLocaleString()}</span> - <strong>Log:</strong>
                </Typography>
                <Typography>{log.message}</Typography>
              </Box>
            ))
          ) : (
            <Typography>Nenhum log encontrado.</Typography>
          )}
        </Box>
      </Box>
    </div>
  );
}
