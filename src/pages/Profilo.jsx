import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { User, Receipt, Ticket, LogOut } from "lucide-react";
import BottomNavbar from "../components/BottomNavbar";
import { useUserContext } from "../components/UserContext";

const UserProfile = () => {
    const navigate = useNavigate();
    const { userData } = useUserContext();

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <ProfileWrapper>
            <div className="container">
                <div className="user-header">
                    <User className="icon" />
                    <h2>{userData?.name || "Utente"}</h2>
                    <p>{userData?.email}</p>
                </div>

                <div className="card-grid">
                    <Card onClick={() => navigate("/liste")}>
                        <Receipt size={32} />
                        <h4>Le mie spese</h4>
                        <p>Visualizza lo storico delle spese salvate</p>
                    </Card>

                    <Card onClick={() => navigate("/vouchers")}>
                        <Ticket size={32} />
                        <h4>I miei voucher</h4>
                        <p>Controlla e gestisci i tuoi buoni</p>
                    </Card>

                    <Card onClick={handleLogout} className="logout">
                        <LogOut size={32} />
                        <h4>Logout</h4>
                        <p>Esci dal tuo account</p>
                    </Card>
                </div>
            </div>
            <BottomNavbar />
        </ProfileWrapper>
    );
};

export default UserProfile;

const ProfileWrapper = styled.div`
  min-height: 100vh;
  padding: 24px 20px 110px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(180deg, #e9f8ff 0%, #ffffff 55%);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
  color: #1f2937;

  .user-header {
    text-align: center;
    margin-bottom: 30px;
    .icon {
      width: 64px;
      height: 64px;
      color: #0ea5e9;
      margin-bottom: 10px;
    }
    h2 {
      font-size: 1.8rem;
      margin: 0;
    }
    p {
      color: #6b7280;
      font-size: 0.95rem;
    }
  }

  .card-grid {
    display: grid;
    gap: 16px;
    width: 100%;
    max-width: 500px;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 10px rgba(14, 165, 233, 0.3);
  }

  h4 {
    margin: 10px 0 5px;
    font-size: 1.2rem;
    color: #111827;
  }

  p {
    font-size: 0.9rem;
    color: #6b7280;
  }

  &.logout {
    border: 1px solid #f87171;
    color: #b91c1c;

    &:hover {
      background: #fee2e2;
    }
  }
`;
