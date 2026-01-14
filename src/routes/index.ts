import { Router } from 'express';
import { UsuarioController } from '../controllers/UsuarioController';
import { PerfilController } from '../controllers/PerfilController';
import { AdministradorController } from '../controllers/AdministradorController';
import { HabitoController } from '../controllers/HabitoController';
import { RegistroHabitoController } from '../controllers/RegistroHabitoController';
import { RelatorioIAController } from '../controllers/RelatorioIAController';

const routes = Router();

// Instanciando os controllers
const usuarioCtrl = new UsuarioController();
const perfilCtrl = new PerfilController();
const adminCtrl = new AdministradorController();
const habitoCtrl = new HabitoController();
const registroCtrl = new RegistroHabitoController();
const relatorioCtrl = new RelatorioIAController();

// --- ROTAS DE USUÁRIO & AUTENTICAÇÃO ---
routes.post('/auth/registrar', usuarioCtrl.registrar);
routes.post('/auth/login', usuarioCtrl.login);
routes.get('/auth/verificar-email', usuarioCtrl.verificarEmail);

// --- ROTAS DE PERFIL ---
routes.get('/perfil/:usuarioId', perfilCtrl.obterPerfil);
routes.put('/perfil/biometria', perfilCtrl.atualizarBiometria);
routes.post('/perfil/verificar-ofensiva', perfilCtrl.checarOfensiva);

// --- ROTAS DE ADMINISTRAÇÃO ---
routes.post('/admin/usuarios', adminCtrl.cadastrarUsuario);
routes.patch('/admin/usuarios/resetar-senha', adminCtrl.resetarSenha);
routes.get('/admin/estatisticas', adminCtrl.obterEstatisticas);
routes.get('/admin/usuarios/:id', adminCtrl.visualizarUsuario);

// --- ROTAS DE HÁBITOS ---
routes.post('/habitos', habitoCtrl.criar);
routes.get('/habitos/perfil/:perfilId', habitoCtrl.listarPorPerfil);
routes.put('/habitos/:id', habitoCtrl.atualizar);
routes.delete('/habitos/:id', habitoCtrl.arquivar);

// --- ROTAS DE REGISTRO DE PROGRESSO ---
routes.post('/registros', registroCtrl.registrarProgresso);
routes.get('/registros/perfil/:perfilId/data/:data', registroCtrl.listarPorData);

// --- ROTAS DE RELATÓRIO IA ---
routes.post('/relatorios-ia', relatorioCtrl.gerar);
routes.get('/relatorios-ia/usuario/:usuarioId', relatorioCtrl.listar);

export default routes;