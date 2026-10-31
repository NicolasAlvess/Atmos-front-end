export default function DiagnosisSummaryCard({ summary }: { summary: string }) {
  return (
    <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 mb-8 shadow-sm print:bg-white print:border-slate-300 print:shadow-none">
      <h3 className="text-lg font-bold text-blue-900 mb-3 print:text-slate-900">
        Parecer Técnico: Resumo do Diagnóstico
      </h3>
      <div className="text-sm text-slate-700 space-y-3 leading-relaxed">
        <p>{summary}</p>
      </div>
    </div>
  );
}
