import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Activity, Plus, ShieldCheck, ShieldAlert, MoreVertical, Server, FileText } from "lucide-react";
import { SERVICE_STATUS_LABELS, SERVICE_STATUS_COLORS } from "../../../components/Badges";
import { fetchServices, updateService, deleteService, selectServices, selectServicesLoading } from "../services.slice";
import { useSocket } from "../../../context/SocketContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu";

export default function Services() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const services = useSelector(selectServices) || [];
  const loading = useSelector(selectServicesLoading);
  const { subscribe } = useSocket();

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  useEffect(() => {
    const unsub = subscribe((evt) => {
      if (evt.eventName?.startsWith('service.')) {
        dispatch(fetchServices());
      }
    });
    return () => unsub && unsub();
  }, [subscribe, dispatch]);


  const handleUpdateStatus = async (id, status) => {
    try {
      await dispatch(updateService({ id, payload: { status } })).unwrap();
      toast.success(`Service status updated to ${status}`);
    } catch (err) {
      toast.error(err.detail || "Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    try {
      await dispatch(deleteService(id)).unwrap();
      toast.success("Service deleted");
    } catch (err) {
      toast.error(err.detail || "Failed to delete service");
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-zinc-950 uppercase italic">
            Services
          </h1>
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-tight">
            Status of your infrastructure and apps.
          </p>
        </div>
        <button 
          onClick={() => navigate("/services/new")}
          className="bg-[#FF6B6B] text-black border-2 border-black text-sm font-black px-5 py-2.5 hover:translate-y-0.5 neo-shadow transition-all uppercase tracking-widest flex items-center gap-2" 
          data-testid="add-service-button"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Add service
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && services.length === 0 ? (
          <>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white border-2 border-black p-5 space-y-4 neo-shadow shimmer-bg">
                <div className="flex justify-between">
                  <div className="w-10 h-10 bg-zinc-100" />
                  <div className="w-4 h-4 bg-zinc-100" />
                </div>
                <div className="space-y-2">
                  <div className="h-5 w-1/2 bg-zinc-100" />
                  <div className="h-3 w-full bg-zinc-100" />
                </div>
              </div>
            ))}
          </>
        ) : services.length === 0 ? (
          <div className="col-span-full py-16 text-center border-2 border-dashed border-zinc-300 bg-white">
            <Activity className="w-10 h-10 text-zinc-300 mx-auto mb-4" />
            <div className="text-lg font-bold text-zinc-950">No services tracked</div>
            <div className="text-sm text-zinc-500 mt-1">Start by adding your first service or API.</div>
          </div>
        ) : (
          services.map((s) => (
            <div key={s.id || s._id} className="bg-white border-2 border-black p-5 hover:bg-zinc-50 transition group neo-shadow flex flex-col h-full">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2 border-2 border-black ${s.status === 'operational' ? 'bg-[#D4F4E4]' : 'bg-[#FFB5E8]'}`}>
                  {s.status === 'operational' ? <ShieldCheck className="w-5 h-5 text-black" /> : <ShieldAlert className="w-5 h-5 text-black" />}
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="text-zinc-400 hover:text-zinc-950 transition p-1">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 border-2 border-black neo-shadow-sm rounded-none">
                    <DropdownMenuItem onClick={() => handleUpdateStatus(s._id, 'operational')} className="cursor-pointer">
                      Mark Operational
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleUpdateStatus(s._id, 'degraded')} className="cursor-pointer">
                      Mark Degraded
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleUpdateStatus(s._id, 'outage')} className="cursor-pointer">
                      Mark Outage
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(s._id)} className="text-red-600 focus:text-red-600 cursor-pointer">
                      Delete Service
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="text-xl font-black tracking-tight text-zinc-950 mb-1">{s.name}</div>
              <div className="text-xs text-zinc-600 mb-6 h-8 line-clamp-2 leading-relaxed flex-1">{s.description || "No description provided."}</div>
              
              <div className="flex items-center justify-between pt-4 border-t-2 border-black">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full border border-black ${SERVICE_STATUS_COLORS[s.status] || 'bg-zinc-300'} pulse-dot`} />
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-zinc-950">
                    {SERVICE_STATUS_LABELS[s.status] || s.status}
                  </span>
                </div>
                <div className="text-[10px] font-mono font-bold text-zinc-500">
                  {s.status === 'operational' ? '100% UPTIME' : s.status === 'degraded' ? '85% UPTIME' : '50% UPTIME'}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
