"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  ShieldPlus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  AlertCircle,
  Loader2,
  Crown,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import type { Admin } from "@/types";

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<"admin" | "super_admin">("admin");
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchAdmins = useCallback(async () => {
    setIsLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("admins")
      .select("*")
      .order("created_at", { ascending: true });

    if (data) {
      setAdmins(
        data.map((a) => ({
          id: a.id,
          email: a.email,
          role: a.role,
          active: a.active,
          createdAt: a.created_at,
        }))
      );
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.email) {
        setCurrentUserEmail(user.email);
        // Fetch own role
        const { data: adminRow } = await supabase
          .from("admins")
          .select("role")
          .eq("email", user.email)
          .single();
        setCurrentUserRole(adminRow?.role ?? null);
      }
      await fetchAdmins();
    };
    init();
  }, [fetchAdmins]);

  const isSuperAdmin = currentUserRole === "super_admin";

  const handleAddAdmin = async () => {
    setError(null);
    if (!newEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      setError("Please enter a valid email address.");
      return;
    }
    setIsAdding(true);
    const supabase = createClient();
    const { error: insertError } = await supabase.from("admins").insert({
      email: newEmail.toLowerCase().trim(),
      role: newRole,
      active: true,
    });

    if (insertError) {
      setError(
        insertError.message.includes("unique")
          ? "This email is already an admin."
          : "Failed to add admin. Please try again."
      );
      setIsAdding(false);
      return;
    }

    setNewEmail("");
    setNewRole("admin");
    setShowAddForm(false);
    setSuccess("Admin added successfully.");
    setTimeout(() => setSuccess(null), 3000);
    await fetchAdmins();
    setIsAdding(false);
  };

  const handleToggleActive = async (admin: Admin) => {
    if (!isSuperAdmin) return;
    if (admin.email === currentUserEmail) {
      setError("You cannot deactivate your own account.");
      setTimeout(() => setError(null), 3000);
      return;
    }
    const supabase = createClient();
    await supabase
      .from("admins")
      .update({ active: !admin.active })
      .eq("id", admin.id);
    await fetchAdmins();
  };

  const handleDelete = async (admin: Admin) => {
    if (!isSuperAdmin) return;
    if (admin.email === currentUserEmail) {
      setError("You cannot delete your own admin account.");
      setTimeout(() => setError(null), 3000);
      return;
    }
    if (!confirm(`Remove ${admin.email} from admins?`)) return;
    const supabase = createClient();
    await supabase.from("admins").delete().eq("id", admin.id);
    setSuccess("Admin removed.");
    setTimeout(() => setSuccess(null), 3000);
    await fetchAdmins();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-2xl font-bold text-charcoal"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Admin Management
          </h1>
          <p className="text-sm text-muted mt-0.5">
            Control who has access to the dashboard
          </p>
        </div>
        {isSuperAdmin && (
          <Button
            onClick={() => setShowAddForm((v) => !v)}
            variant="primary"
            className="gap-2"
          >
            <ShieldPlus size={16} />
            Add Admin
          </Button>
        )}
      </div>

      {/* Alerts */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4"
          >
            <AlertCircle size={15} className="shrink-0" />
            {error}
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 bg-forest/10 border border-forest/20 text-forest-dark text-sm rounded-xl px-4 py-3 mb-4"
          >
            <ShieldCheck size={15} className="shrink-0" />
            {success}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Admin Form */}
      <AnimatePresence>
        {showAddForm && isSuperAdmin && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-2xl border border-border p-5 mb-6 overflow-hidden"
          >
            <h2 className="font-semibold text-charcoal mb-4">
              Add New Admin
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <Input
                label="Email Address"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="admin@example.com"
                required
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-charcoal">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  value={newRole}
                  onChange={(e) =>
                    setNewRole(e.target.value as "admin" | "super_admin")
                  }
                  className="h-11 rounded-xl border border-border bg-white px-4 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-forest focus:border-forest"
                >
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleAddAdmin}
                variant="primary"
                size="sm"
                loading={isAdding}
                className="gap-2"
              >
                <ShieldPlus size={14} />
                Add Admin
              </Button>
              <Button
                onClick={() => {
                  setShowAddForm(false);
                  setError(null);
                }}
                variant="ghost"
                size="sm"
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admins List */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={24} className="animate-spin text-muted" />
          </div>
        ) : admins.length === 0 ? (
          <div className="text-center py-12 text-muted text-sm">
            No admins found.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {admins.map((admin) => (
              <div
                key={admin.id}
                className="flex items-center justify-between px-5 py-4 gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-forest/10 flex items-center justify-center shrink-0">
                    {admin.role === "super_admin" ? (
                      <Crown size={16} className="text-saffron-dark" />
                    ) : (
                      <ShieldCheck size={16} className="text-forest" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-charcoal truncate">
                      {admin.email}
                      {admin.email === currentUserEmail && (
                        <span className="ml-2 text-xs text-muted font-normal">
                          (you)
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted">
                      Added {formatDate(admin.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Badge
                    variant={admin.role === "super_admin" ? "saffron" : "success"}
                    size="sm"
                  >
                    {admin.role === "super_admin" ? "Super Admin" : "Admin"}
                  </Badge>
                  <Badge
                    variant={admin.active ? "success" : "warning"}
                    size="sm"
                  >
                    {admin.active ? "Active" : "Inactive"}
                  </Badge>

                  {isSuperAdmin && admin.email !== currentUserEmail && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggleActive(admin)}
                        className="p-1.5 rounded-lg text-muted hover:text-charcoal hover:bg-cream-dark transition-colors"
                        title={admin.active ? "Deactivate" : "Activate"}
                      >
                        {admin.active ? (
                          <ToggleRight size={18} className="text-forest" />
                        ) : (
                          <ToggleLeft size={18} />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(admin)}
                        className="p-1.5 rounded-lg text-muted hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="Remove admin"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {!isSuperAdmin && (
        <p className="text-xs text-muted mt-4 text-center">
          Only Super Admins can add or remove admins.
        </p>
      )}
    </div>
  );
}
