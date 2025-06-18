const mockedCustomers = [
  {
    name: 'Ygor Silva',
    cpf: '123.456.789-00',
    phone: '(11) 98765-4321',
    score: 800,
    value: 2400,
    type: 'money',
    stage: [
      'Interessado',
      'Visita Marcada',
      'Aguardando Documentação',
      'Documentação Enviada',
      'Documentação Aprovada',
      'Contrato Assinado',
    ],
    building: [
      'Empreendimento A',
      'Empreendimento B',
      'Empreendimento C',
    ],
    jorney: [
      'Nenhuma',
      'Low Ticket + Visita',
      'Power Script'
    ]
  },
  {
    name: 'Ana Paula Souza',
    cpf: '295.184.637-20',
    phone: '(21) 99876-5432',
    score: 725,
    value: 2890,
    type: 'money',
    stage: [
      'Interessado',
      'Visita Marcada',
      'Aguardando Documentação',
      'Documentação Enviada',
      'Documentação Aprovada',
      'Contrato Assinado',
    ],
    building: [
      'Empreendimento A',
      'Empreendimento B',
      'Empreendimento C',
    ],
    jorney: [
      'Nenhuma',
      'Low Ticket + Visita',
      'Power Script'
    ]
  },
  {
    name: 'Carlos Henrique Lima',
    cpf: '417.982.365-09',
    phone: '(11) 91234-5678',
    score: 845,
    value: 1720,
    type: 'money',
    stage: [
      'Interessado',
      'Visita Marcada',
      'Aguardando Documentação',
      'Documentação Enviada',
      'Documentação Aprovada',
      'Contrato Assinado',
    ],
    building: [
      'Empreendimento A',
      'Empreendimento B',
      'Empreendimento C',
    ],
    jorney: [
      'Nenhuma',
      'Low Ticket + Visita',
      'Power Script'
    ]
  },
  {
    name: 'Fernanda Oliveira',
    cpf: '583.726.491-30',
    phone: '(31) 98765-1234',
    score: 390,
    value: 1980,
    type: 'money',
    stage: [
      'Interessado',
      'Visita Marcada',
      'Aguardando Documentação',
      'Documentação Enviada',
      'Documentação Aprovada',
      'Contrato Assinado',
    ],
    building: [
      'Empreendimento A',
      'Empreendimento B',
      'Empreendimento C',
    ],
    jorney: [
      'Nenhuma',
      'Low Ticket + Visita',
      'Power Script'
    ]
  },
  {
    name: 'Lucas Martins',
    cpf: '104.582.963-47',
    phone: '(41) 93456-7890',
    score: 610,
    value: 2600,
    type: 'money',
    stage: [
      'Interessado',
      'Visita Marcada',
      'Aguardando Documentação',
      'Documentação Enviada',
      'Documentação Aprovada',
      'Contrato Assinado',
    ],
    building: [
      'Empreendimento A',
      'Empreendimento B',
      'Empreendimento C',
    ],
    jorney: [
      'Nenhuma',
      'Low Ticket + Visita',
      'Power Script'
    ]
  },
  {
    name: 'Juliana Costa',
    cpf: '836.295.174-62',
    phone: '(51) 97654-3210',
    score: 980,
    value: 3000,
    type: 'money',
    stage: [
      'Interessado',
      'Visita Marcada',
      'Aguardando Documentação',
      'Documentação Enviada',
      'Documentação Aprovada',
      'Contrato Assinado',
    ],
    building: [
      'Empreendimento A',
      'Empreendimento B',
      'Empreendimento C',
    ],
    jorney: [
      'Nenhuma',
      'Low Ticket + Visita',
      'Power Script'
    ]
  },
  {
    name: 'Rafael Almeida',
    cpf: '219.468.357-81',
    phone: '(61) 96543-2109',
    score: 350,
    value: 1650,
    type: 'money',
    stage: [
      'Interessado',
      'Visita Marcada',
      'Aguardando Documentação',
      'Documentação Enviada',
      'Documentação Aprovada',
      'Contrato Assinado',
    ],
    building: [
      'Empreendimento A',
      'Empreendimento B',
      'Empreendimento C',
    ],
    jorney: [
      'Nenhuma',
      'Low Ticket + Visita',
      'Power Script'
    ]
  },
  {
    name: 'Patrícia Mendes',
    cpf: '328.759.416-05',
    phone: '(71) 98712-3456',
    score: 790,
    value: 2100,
    type: 'money',
    stage: [
      'Interessado',
      'Visita Marcada',
      'Aguardando Documentação',
      'Documentação Enviada',
      'Documentação Aprovada',
      'Contrato Assinado',
    ],
    building: [
      'Empreendimento A',
      'Empreendimento B',
      'Empreendimento C',
    ],
    jorney: [
      'Nenhuma',
      'Low Ticket + Visita',
      'Power Script'
    ]
  },
  {
    name: 'Bruno Ferreira',
    cpf: '547.193.826-40',
    phone: '(81) 99876-5432',
    score: 670,
    value: 1850,
    type: 'money',
    stage: [
      'Interessado',
      'Visita Marcada',
      'Aguardando Documentação',
      'Documentação Enviada',
      'Documentação Aprovada',
      'Contrato Assinado',
    ],
    building: [
      'Empreendimento A',
      'Empreendimento B',
      'Empreendimento C',
    ],
    jorney: [
      'Nenhuma',
      'Low Ticket + Visita',
      'Power Script'
    ]
  },
  {
    name: 'Mariana Ribeiro',
    cpf: '692.318.547-23',
    phone: '(85) 91234-5678',
    score: 920,
    value: 2990,
    type: 'money',
    stage: [
      'Interessado',
      'Visita Marcada',
      'Aguardando Documentação',
      'Documentação Enviada',
      'Documentação Aprovada',
      'Contrato Assinado',
    ],
    building: [
      'Empreendimento A',
      'Empreendimento B',
      'Empreendimento C',
    ],
    jorney: [
      'Nenhuma',
      'Low Ticket + Visita',
      'Power Script'
    ]
  },
  {
    name: 'Eduardo Gomes',
    cpf: '813.246.579-64',
    phone: '(31) 97654-1230',
    score: 480,
    value: 1700,
    type: 'money',
    stage: [
      'Interessado',
      'Visita Marcada',
      'Aguardando Documentação',
      'Documentação Enviada',
      'Documentação Aprovada',
      'Contrato Assinado',
    ],
    building: [
      'Empreendimento A',
      'Empreendimento B',
      'Empreendimento C',
    ],
    jorney: [
      'Nenhuma',
      'Low Ticket + Visita',
      'Power Script'
    ]
  },
  {
    name: 'Sofia Pires',
    cpf: '159.753.486-28',
    phone: '(19) 93456-7891',
    score: 555,
    value: 2000,
    type: 'money',
    stage: [
      'Interessado',
      'Visita Marcada',
      'Aguardando Documentação',
      'Documentação Enviada',
      'Documentação Aprovada',
      'Contrato Assinado',
    ],
    building: [
      'Empreendimento A',
      'Empreendimento B',
      'Empreendimento C',
    ],
    jorney: [
      'Nenhuma',
      'Low Ticket + Visita',
      'Power Script'
    ]
  },
]

export default mockedCustomers