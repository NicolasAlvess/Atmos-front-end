interface SelectField {
  name: string;
  label: string;
  options: string[];
}

const FIELDS: SelectField[] = [
  {
    name: 'tempo_empresa',
    label: 'Tempo de Empresa',
    options: [
      'Menos de 6 meses',
      '6 meses a 1 ano',
      '1 a 3 anos',
      '3 a 5 anos',
      'Mais de 5 anos'
    ]
  },
  {
    name: 'setor',
    label: 'Setor',
    options: [
      'Operacional',
      'Administrativo / Backoffice',
      'Comercial / Vendas',
      'Liderança / Gestão'
    ]
  },
  {
    name: 'faixa_etaria',
    label: 'Faixa Etária',
    options: [
      'Até 24 anos',
      '25 a 34 anos',
      '35 a 44 anos',
      '45 a 54 anos',
      '55 anos ou mais',
      'Prefiro não responder'
    ]
  },
  {
    name: 'genero',
    label: 'Gênero',
    options: ['Feminino', 'Masculino', 'Não binário', 'Prefiro não responder']
  },
  {
    name: 'raca_cor',
    label: 'Raça/Cor',
    options: [
      'Branca',
      'Preta',
      'Parda',
      'Amarela',
      'Indígena',
      'Prefiro não responder'
    ]
  }
];

export default function DemographicsStep({
  formData,
  onChange
}: {
  formData: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <section className="bg-white border border-[#dce7f2] rounded-2xl p-6 sm:p-8 shadow-sm">
      <div className="border-b border-slate-100 pb-5 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase font-extrabold tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                Passo 1
              </span>
              <span className="text-xs font-semibold text-slate-500">Demografia</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Dados Gerais
            </h3>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
          As respostas demográficas abaixo não serão cruzadas de modo individual. Grupos são
          agregados para total sigilo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {FIELDS.map((field) => (
          <div key={field.name} className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700">{field.label}</label>
            <select
              name={field.name}
              value={formData[field.name]}
              onChange={onChange}
              className="w-full rounded-xl border border-slate-300 bg-white py-2.5 px-3.5 text-sm font-medium text-slate-800 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              required
            >
              <option value="">Selecione...</option>
              {field.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </section>
  );
}
