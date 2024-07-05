import CreateSeriesForm from "@/components/admin/create_series_form";

export default function CreateSeriesPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Create New Series</h1>
      <CreateSeriesForm />
    </div>
  );
}
