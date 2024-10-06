'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClient } from '@/utils/supabase/client';
import { getClients, addProject } from '@/utils/supabase/queries';

export default function AddProjectForm() {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    client_id: '',
    currency: '',
    contract_owner: '',
    start_date: '',
    end_date: '',
    deal_status: '',
    billable: 'false', // Changed to string for Select
    engagement_manager_email: '',
    note: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [clients, setClients] = useState<any[]>([]);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clients = await getClients(supabase);
        if (clients) {
          setClients(clients);
        } else {
          setError('Failed to fetch clients.');
        }
      } catch (error) {
        setError('Failed to fetch clients.');
      }
    };

    fetchClients();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.code || !formData.name || !formData.client_id || !formData.contract_owner || !formData.engagement_manager_email) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      const data = await addProject(supabase, formData);
        console.log('Project added successfully:', data);
        router.push('/projects');
    } catch (error: any) {
      setError(error.message || 'Failed to add project.');
      console.error('Error adding project:', error);
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Add New Project</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="code">Project Code *</Label>
              <Input
                id="code"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                required
                maxLength={50}
              />
            </div>
            <div>
              <Label htmlFor="name">Project Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                maxLength={255}
              />
            </div>
            <div>
              <Label htmlFor="client_id">Client *</Label>
              <Select name="client_id" onValueChange={(value) => handleSelectChange('client_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Input
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                maxLength={6}
              />
            </div>
            <div>
              <Label htmlFor="contract_owner">Contract Owner *</Label>
              <Input
                id="contract_owner"
                name="contract_owner"
                value={formData.contract_owner}
                onChange={handleInputChange}
                required
                maxLength={50}
              />
            </div>
            <div>
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                name="start_date"
                type="date"
                value={formData.start_date}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                name="end_date"
                type="date"
                value={formData.end_date}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="deal_status">Deal Status *</Label>
              <Select name="deal_status" onValueChange={(value) => handleSelectChange('deal_status', value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select deal status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="WON">Won</SelectItem>
                  <SelectItem value="LOST">Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="billable">Billable *</Label>
              <Select name="billable" onValueChange={(value) => handleSelectChange('billable', value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select billable status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="engagement_manager_email">Engagement Manager Email *</Label>
              <Input
                id="engagement_manager_email"
                name="engagement_manager_email"
                type="email"
                value={formData.engagement_manager_email}
                onChange={handleInputChange}
                required
                maxLength={255}
              />
            </div>
            <div>
              <Label htmlFor="note">Note</Label>
              <Input
                id="note"
                name="note"
                value={formData.note}
                onChange={handleInputChange}
              />
            </div>
            {error && <div className="text-red-500 bg-red-100 p-2 rounded">{error}</div>}
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => router.push('/projects')}>Cancel</Button>
              <Button type="submit">Submit</Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}