import test from 'node:test';
import assert from 'node:assert/strict';
import { generateSmartReply } from './chatbotKnowledge.js';
import { PROTOCOLS_DATA } from '../data/protocolsList.js';

test('returns dedicated detailed answer for each single protocol without grouping', () => {
  const ospf = generateSmartReply('Explique le protocole OSPF');
  assert.match(ospf, /Open Shortest Path First/);
  assert.match(ospf, /RFC 2328/);
  assert.doesNotMatch(ospf, /WireGuard|Kerberos|SNMP/);

  const kerberos = generateSmartReply("C'est quoi Kerberos ?");
  assert.match(kerberos, /Kerberos/);
  assert.match(kerberos, /Port 88/);
  assert.match(kerberos, /Kerberoasting/);
  assert.doesNotMatch(kerberos, /OSPF|BGP/);

  // Ensure every single protocol in PROTOCOLS_DATA resolves individually when queried by name
  for (const proto of PROTOCOLS_DATA) {
    const query = `Explique ${proto.name}`;
    const reply = generateSmartReply(query);
    assert.ok(
      reply.includes(proto.name) || reply.includes(proto.fullName),
      `Expected reply for ${proto.name} to mention it, got: ${reply}`
    );
  }
});

test('handles technical comparisons accurately', () => {
  const tcpUdp = generateSmartReply('Quelle différence entre TCP et UDP ?');
  assert.match(tcpUdp, /TCP \(Orienté connexion/);
  assert.match(tcpUdp, /UDP \(Sans connexion/);

  const vpnCmp = generateSmartReply('IPsec vs WireGuard');
  assert.match(vpnCmp, /IKEv2/);
  assert.match(vpnCmp, /51820/);
});

test('gives granular answers per specific skill/tool without lumping unrelated skills', () => {
  const proxmox = generateSmartReply('Que maîtrise-t-il sur Proxmox ?');
  assert.match(proxmox, /Proxmox VE/);
  assert.match(proxmox, /Haute Disponibilité/);
  assert.doesNotMatch(proxmox, /Chicken Point/);

  const suricata = generateSmartReply('Parle-moi de Suricata');
  assert.match(suricata, /IDS\/IPS/);
  assert.match(suricata, /Snort/);

  const iac = generateSmartReply('Utilise-t-il Puppet ou Ansible ?');
  assert.match(iac, /Puppet/);
  assert.match(iac, /Ansible/);
  assert.match(iac, /KeePass/);
});

test('gives granular answers per specific veille axis and source', () => {
  const ueba = generateSmartReply("C'est quoi l'UEBA ?");
  assert.match(ueba, /Axe 1/);
  assert.match(ueba, /zero-day/i);
  assert.doesNotMatch(ueba, /Axe 2/);

  const soar = generateSmartReply('Explique le rôle du SOAR et MTTR');
  assert.match(soar, /Axe 2/);
  assert.match(soar, /MTTR/);

  const feedly = generateSmartReply('Quels outils utilise-t-il avec Feedly et ANSSI ?');
  assert.match(feedly, /Feedly/);
  assert.match(feedly, /ANSSI \/ CERT-FR/);
});

test('distinguishes individual stages and projects instead of grouping them', () => {
  const stage1 = generateSmartReply('Quelles missions lors du stage de 1ère année ?');
  assert.match(stage1, /1ère année/);
  assert.match(stage1, /Mai – Juil\. 2026/);
  assert.match(stage1, /E\.Leclerc/);
  assert.match(stage1, /brassage/i);
  assert.doesNotMatch(stage1, /Nov\. 2026 – Janv\. 2027/);

  const stage2 = generateSmartReply('Parle-moi du stage de 2ème année');
  assert.match(stage2, /2ème année/);
  assert.match(stage2, /Nov\. 2026 – Janv\. 2027/);
  assert.match(stage2, /pfSense/);
  assert.doesNotMatch(stage2, /Mai – Juil\. 2026/);

  const rituels = generateSmartReply('Détails sur Rituels du Monde');
  assert.match(rituels, /Mistral Cloud/);
  assert.match(rituels, /Ollama/);
  assert.doesNotMatch(rituels, /Shop Ton Auto/);
});

test('resolves multi-turn follow-up questions using conversation history', () => {
  const history = [
    { role: 'user', content: 'Explique le protocole OSPF' },
    { role: 'assistant', content: generateSmartReply('Explique le protocole OSPF') },
    { role: 'user', content: 'Et la sécurité ?' },
  ];
  const secReply = generateSmartReply(history);
  assert.match(secReply, /Sécurisation & Durcissement — OSPF/);
  assert.match(secReply, /HMAC-SHA/);

  const portHistory = [
    { role: 'user', content: 'Parle-moi de WireGuard' },
    { role: 'assistant', content: generateSmartReply('Parle-moi de WireGuard') },
    { role: 'user', content: 'Quel port utilise-t-il ?' },
  ];
  const portReply = generateSmartReply(portHistory);
  assert.match(portReply, /51820/);

  const kerberosSecHistory = [
    { role: 'user', content: 'Explique le protocole Kerberos' },
    { role: 'assistant', content: generateSmartReply('Explique le protocole Kerberos') },
    { role: 'user', content: 'Et comment le sécuriser ?' },
  ];
  const kerberosSecReply = generateSmartReply(kerberosSecHistory);
  assert.match(kerberosSecReply, /Sécurisation & Durcissement — Kerberos/);
});
