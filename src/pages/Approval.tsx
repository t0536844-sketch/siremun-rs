import { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Filter,
  MessageSquare,
  User,
  Building2,
  FileText,
  Wallet,
  Stethoscope,
  BarChart3,
  Search,
  ShieldCheck,
} from 'lucide-react';
import { dataApproval } from '../data/mockData';
import { formatRupiah, formatDateShort, statusColors, statusLabel } from '../utils/helpers';
import type { ApprovalItem } from '../data/mockData';
import { useApp } from '../context/AppContext';

const levelColors: Record<string, string> = {
  Unit: 'bg-amber-100 text-amber-700 border-amber-200',
  Keuangan: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  Direksi: 'bg-teal-100 text-teal-700 border-teal-200',
};

const tipeIcon: Record<string, any> = {
  pendapatan: Wallet,
  jasa: Stethoscope,
  hasil: BarChart3,
};

const tipeLabel: Record<string, string> = {
  pendapatan: 'Data Pendapatan',
  jasa: 'Jasa Medis',
  hasil: 'Hasil Kalkulasi',
};

export default function Approval() {
  const { showToast } = useApp();
  const [items, setItems] = useState<ApprovalItem[]>(dataApproval);
  const [search, setSearch] = useState('');
  const [filterTipe, setFilterTipe] = useState('Semua');
  const [filterLevel, setFilterLevel] = useState('Semua');
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [catatan, setCatatan] = useState('');
  const [selected, setSelected] = useState<ApprovalItem | null>(null);
  const [showNoteModal, setShowNoteModal] = useState(false);

  const filtered = items.filter(
    (item) =>
      (filterTipe === 'Semua' || item.tipe === filterTipe) &&
      (filterLevel === 'Semua' || item.level === filterLevel) &&
      (filterStatus === 'Semua' || item.status === filterStatus) &&
      (item.referensi.toLowerCase().includes(search.toLowerCase()) ||
        item.pengaju.toLowerCase().includes(search.toLowerCase()) ||
        item.catatan.toLowerCase().includes(search.toLowerCase()))
  );

  const totalPending = items.filter((i) => i.status === 'pending').length;
  const totalApproved = items.filter((i) => i.status === 'approved').length;
  const totalRejected = items.filter((i) => i.status === 'rejected').length;
  const totalNilaiPending = items.filter((i) => i.status === 'pending').reduce((s, i) => s + i.nilai, 0);

  const handleApprove = (id: string) => {
    const item = items.find((i) => i.id === id);
    setItems(items.map((i) => (i.id === id ? { ...i, status: 'approved' as const } : i)));
    if (item) {
      showToast('success', 'Pengajuan disetujui', `${item.referensi} (${formatRupiah(item.nilai)})`);
    }
  };

  const handleReject = (id: string) => {
    setSelected(items.find((i) => i.id === id) || null);
    setShowNoteModal(true);
  };

  const confirmReject = () => {
    if (selected) {
      setItems(items.map((i) => (i.id === selected.id ? { ...i, status: 'rejected' as const, catatan: catatan || i.catatan } : i)));
      showToast('warning', 'Pengajuan ditolak', `${selected.referensi} - alasan dicatat`);
      setShowNoteModal(false);
      setCatatan('');
      setSelected(null);
    }
  };

  const approveAll = () => {
    if (confirm(`Setujui SEMUA ${totalPending} pengajuan yang menunggu?`)) {
      setItems(items.map((i) => (i.status === 'pending' ? { ...i, status: 'approved' as const } : i)));
      showToast('success', 'Bulk approval berhasil', `${totalPending} pengajuan telah disetujui`);
    }
  };

  return (
    <div className="p-6 space-y-5 bg-slate-50">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-amber-100" />
            <span className="text-3xl font-bold">{totalPending}</span>
          </div>
          <p className="text-amber-50 text-xs">Menunggu Persetujuan</p>
          <p className="text-xs text-amber-100 mt-1">{formatRupiah(totalNilaiPending)}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span className="text-3xl font-bold text-emerald-700">{totalApproved}</span>
          </div>
          <p className="text-slate-500 text-xs">Disetujui</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <XCircle className="w-5 h-5 text-rose-600" />
            <span className="text-3xl font-bold text-rose-700">{totalRejected}</span>
          </div>
          <p className="text-slate-500 text-xs">Ditolak</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <ShieldCheck className="w-5 h-5 text-teal-600" />
            <span className="text-3xl font-bold text-teal-700">{items.length}</span>
          </div>
          <p className="text-slate-500 text-xs">Total Pengajuan</p>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            value={filterTipe}
            onChange={(e) => setFilterTipe(e.target.value)}
            className="bg-transparent text-sm focus:outline-none min-w-[130px]"
          >
            <option>Semua</option>
            <option value="pendapatan">Pendapatan</option>
            <option value="jasa">Jasa</option>
            <option value="hasil">Hasil</option>
          </select>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
          <Building2 className="w-4 h-4 text-slate-500" />
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="bg-transparent text-sm focus:outline-none min-w-[130px]"
          >
            <option>Semua</option>
            <option>Unit</option>
            <option>Keuangan</option>
            <option>Direksi</option>
          </select>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
          <AlertTriangle className="w-4 h-4 text-slate-500" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-transparent text-sm focus:outline-none min-w-[120px]"
          >
            <option>Semua</option>
            <option value="pending">Menunggu</option>
            <option value="approved">Disetujui</option>
            <option value="rejected">Ditolak</option>
          </select>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari referensi atau pengaju..."
            className="bg-transparent text-sm focus:outline-none w-full"
          />
        </div>
        {totalPending > 0 && (
          <button
            onClick={approveAll}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4" />
            Approve Semua
          </button>
        )}
      </div>

      {/* Approvals List */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center">
            <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-slate-500">Tidak ada data persetujuan dengan filter yang dipilih</p>
          </div>
        )}
        {filtered.map((item) => {
          const TipeIcon = tipeIcon[item.tipe];
          return (
            <div
              key={item.id}
              className={`bg-white rounded-2xl border ${
                item.status === 'pending' ? 'border-amber-200 shadow-sm' : 'border-slate-200'
              } overflow-hidden`}
            >
              <div className="p-5 flex flex-wrap items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-700 text-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <TipeIcon className="w-7 h-7" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${levelColors[item.level]}`}>
                      Level: {item.level}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                      {tipeLabel[item.tipe]}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${statusColors[item.status]}`}>
                      {statusLabel[item.status]}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-800 flex items-center gap-2 flex-wrap">
                    {item.referensi}
                    <span className="text-slate-300">·</span>
                    <span className="text-lg font-bold text-teal-700">{formatRupiah(item.nilai)}</span>
                  </h4>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {item.pengaju}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDateShort(item.tanggalPengajuan)}
                    </span>
                    {item.catatan && (
                      <span className="flex items-center gap-1 text-slate-600 italic">
                        <MessageSquare className="w-3 h-3" />
                        {item.catatan}
                      </span>
                    )}
                  </div>
                </div>

                {item.status === 'pending' && (
                  <div className="flex flex-shrink-0 gap-2">
                    <button
                      onClick={() => handleApprove(item.id)}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Setujui
                    </button>
                    <button
                      onClick={() => handleReject(item.id)}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-lg border border-rose-200"
                    >
                      <XCircle className="w-4 h-4" />
                      Tolak
                    </button>
                  </div>
                )}

                {item.status !== 'pending' && (
                  <div className="flex flex-shrink-0">
                    {item.status === 'approved' ? (
                      <span className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-lg">
                        <CheckCircle2 className="w-4 h-4" />
                        Disetujui
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 px-3 py-2 bg-rose-50 text-rose-700 text-xs font-semibold rounded-lg">
                        <XCircle className="w-4 h-4" />
                        Ditolak
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Reject Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-rose-700 to-rose-800 text-white px-6 py-5">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <XCircle className="w-5 h-5" />
                Tolak Pengajuan
              </h3>
              <p className="text-xs text-rose-100 mt-1">{selected?.referensi}</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">Alasan Penolakan *</label>
                <textarea
                  rows={4}
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  placeholder="Tuliskan alasan mengapa pengajuan ini ditolak..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">Catatan ini akan dikirim ke pengaju ({selected?.pengaju})</p>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowNoteModal(false);
                  setCatatan('');
                  setSelected(null);
                }}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                onClick={confirmReject}
                disabled={!catatan}
                className="px-5 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 rounded-lg shadow-sm"
              >
                Konfirmasi Tolak
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
