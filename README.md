This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## 🎟️ Ticketless - Civic Auth Web3 Hackathon Project

A ticketless event management system using Civic Auth for Web3 authentication and embedded wallets.

### Features

- **Civic Auth Integration**: Seamless Web3 login with embedded wallet creation
- **Event RSVP System**: Users can RSVP to events and receive QR code tickets
- **QR Code Scanning**: Organizers can scan tickets for check-in
- **PostgreSQL Database**: Persistent storage for users, events, RSVPs, and check-ins
- **Modern UI**: Clean, responsive interface built with Tailwind CSS

### Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Authentication**: Civic Auth Web3
- **Database**: PostgreSQL with Prisma ORM
- **Wallet**: Embedded wallets via Civic
- **QR Codes**: react-qr-code for generation, @zxing/browser for scanning

### Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   Create `.env.local` file:
   ```bash
   # Civic Auth Configuration
   NEXT_PUBLIC_CIVIC_CLIENT_ID=your_civic_client_id_here
   
   # Database Configuration (PostgreSQL)
   DATABASE_URL="postgresql://username:password@localhost:5432/blue_tick_db"
   
   # Ticket Security
   TICKET_SECRET=your_strong_random_secret_here
   ```

3. **Database Setup**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Optional: Open Prisma Studio
   npm run db:studio
   ```

4. **Civic Auth Setup**
   - Sign up at [auth.civic.com](https://auth.civic.com)
   - Create an app and get your Client ID
   - Add `http://localhost:3000` to Allowed Origins
   - Update `NEXT_PUBLIC_CIVIC_CLIENT_ID` in `.env.local`

5. **Run Development Server**
   ```bash
   npm run dev
   ```

### Application Flow

1. **User Journey**:
   - Sign in with Civic Auth → embedded wallet auto-creates
   - Browse events at `/events`
   - RSVP to events → receive QR code ticket
   - View tickets at `/my-tickets`

2. **Organizer Journey**:
   - Access scanner at `/scan`
   - Scan attendee QR codes
   - Confirm check-ins

### Database Schema

- **Users**: Email, wallet address, creation date
- **Events**: Title, description, date, location, organizer
- **RSVPs**: User-event relationship with ticket tokens
- **Check-ins**: Attendance tracking with timestamps

### API Endpoints

- `GET /api/me`: Ensure user exists (auto-signup) and return user
- `POST /api/me`: Update user wallet address
- `GET /api/events`: List events
- `POST /api/events`: Create event (requires auth)
- `GET /api/events/:id`: Get event detail
- `POST /api/rsvp`: Create RSVP and generate ticket token
- `GET /api/tickets`: List RSVPs for current user with event info
- `POST /api/checkin`: Validate ticket and record check-in

### Deployment

1. **Database**: Set up PostgreSQL (Vercel Postgres, Supabase, etc.)
2. **Environment**: Configure production environment variables
3. **Deploy**: Deploy to Vercel or your preferred platform
4. **Civic**: Add production domain to Civic Auth Allowed Origins

### Hackathon Demo

**Demo Video Script (2 minutes)**:
1. Open `/` → click Sign in → show email + wallet address + balance (auto user created)
2. Go to `/events` → click RSVP → show QR code generation
3. Open `/my-tickets` → display real tickets from API
4. Open `/scan` (organizer) → scan QR with camera → "Check-in successful"

### QR Format

- Ticket QR links to `/ticket/{token}`. Check-in derives `eventId` from the RSVP record.

**Project Description**: "Ticketless is a Web3-native event management platform that eliminates physical tickets through Civic Auth embedded wallets and QR code verification, providing seamless check-in experiences for both attendees and organizers."
