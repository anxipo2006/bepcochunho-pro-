import { ConsultationStatus } from "@prisma/client";
import { updateConsultationStatusAction } from "@/actions/consultation";
import { Badge } from "@/components/ui/badge";
import { SubmitButton } from "@/components/ui/submit-button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { inputClass } from "@/components/ui/form";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

const statusLabels: Record<ConsultationStatus, string> = {
  NEW: "Mới",
  CONTACTED: "Đã liên hệ",
  CLOSED: "Đã chốt",
};

export default async function AdminConsultationsPage() {
  const leads = await prisma.consultationLead.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });

  return (
    <Card>
      <CardHeader
        title="Tư vấn khách hàng"
        description="Danh sách doanh nghiệp gửi form nhận tư vấn từ trang chủ. Bếp gọi lại/Zalo theo số điện thoại này."
      />
      <CardContent className="grid gap-3">
        {leads.map((lead) => (
          <div key={lead.id} className="grid gap-4 rounded-lg border border-slate-200 p-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-semibold text-slate-950">{lead.companyName}</h2>
                <Badge tone={lead.status === "NEW" ? "amber" : lead.status === "CONTACTED" ? "teal" : "green"}>
                  {statusLabels[lead.status]}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                SĐT/Zalo: <a className="font-semibold text-coral-dark" href={`tel:${lead.phone}`}>{lead.phone}</a> · Số lượng: {lead.expectedQuantity} · Gửi ngày {formatDate(lead.createdAt)}
              </p>
            </div>
            <form action={updateConsultationStatusAction} className="flex flex-col gap-2 sm:flex-row">
              <input type="hidden" name="id" value={lead.id} />
              <select className={inputClass} name="status" defaultValue={lead.status}>
                <option value="NEW">Mới</option>
                <option value="CONTACTED">Đã liên hệ</option>
                <option value="CLOSED">Đã chốt</option>
              </select>
              <SubmitButton pendingLabel="Đang cập nhật...">Cập nhật</SubmitButton>
            </form>
          </div>
        ))}
        {leads.length === 0 ? <p className="text-sm text-slate-500">Chưa có khách hàng gửi tư vấn.</p> : null}
      </CardContent>
    </Card>
  );
}
