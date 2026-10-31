import { Request, Response, NextFunction } from 'express';
import { supabaseServer } from '../lib/supabase-server.ts';

export interface AuthenticatedUser {
  uid: string;
  email: string;
  name: string;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const tokenMatch = authHeader?.match(/^Bearer\s+(\S+)$/i);
  if (!tokenMatch) {
    return res.status(401).json({ error: 'Unauthorized: Missing authentication token' });
  }
  const token = tokenMatch[1];

  try {
    const { data, error } = await supabaseServer.auth.getUser(token);
    if (error) {
      if (error.status === 401 || error.status === 403) {
        return res.status(401).json({ error: 'Unauthorized: Token verification failed' });
      }
      console.error('Authentication service verification error:', error.message);
      return res.status(503).json({ error: 'Authentication service is temporarily unavailable' });
    }
    if (!data.user) {
      return res.status(401).json({ error: 'Unauthorized: Token verification failed' });
    }

    const decoded = data.user;
    req.user = {
      uid: decoded.id,
      email: decoded.email || '',
      name:
        decoded.user_metadata?.full_name ||
        decoded.user_metadata?.name ||
        decoded.email?.split('@')[0] ||
        'Creator User'
    };
    next();
  } catch (error: unknown) {
    console.error(
      'Authentication verification failure:',
      error instanceof Error ? error.message : error
    );
    return res.status(503).json({ error: 'Authentication service is temporarily unavailable' });
  }
};
