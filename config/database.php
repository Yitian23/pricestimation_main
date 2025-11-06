<?php
// Database configuration for Railway hosting with XAMPP fallback
class Database {
    private $host;
    private $db_name;
    private $username;
    private $password;
    private $port;
    public $conn;

    public function __construct() {
        // Load .env file if it exists (for local development)
        $this->loadEnv();
        
        // Check if running on Railway (environment variables are set)
        if (getenv('MYSQLDATABASE') || getenv('DATABASE_URL')) {
            // Railway MySQL configuration
            if (getenv('DATABASE_URL')) {
                // Parse DATABASE_URL if provided (format: mysql://user:pass@host:port/dbname)
                $url = parse_url(getenv('DATABASE_URL'));
                $this->host = $url['host'] ?? 'mainline.proxy.rlwy.net';
                $this->username = $url['user'] ?? 'root';
                $this->password = $url['pass'] ?? 'TopjJThFOXjwZnpEATjRgOQfgXdqLRLN';
                $this->db_name = ltrim($url['path'] ?? 'railway', '/');
                $this->port = $url['port'] ?? 43424;
            } else {
                // Individual environment variables
                $this->host = getenv('MYSQLHOST') ?: 'mysql.railway.internal';
                $this->db_name = getenv('MYSQLDATABASE') ?: 'railway';
                $this->username = getenv('MYSQLUSER') ?: 'root';
                $this->password = getenv('MYSQLPASSWORD') ?: 'TopjJThFOXjwZnpEATjRgOQfgXdqLRLN';
                $this->port = getenv('MYSQLPORT') ?: 3306;
            }
        } else {
            // Local XAMPP configuration (fallback)
            $this->host = 'localhost';
            $this->db_name = 'real_estate_management';
            $this->username = 'root';
            $this->password = '';
            $this->port = 3306;
        }
    }

    public function getConnection() {
        $this->conn = null;
        
        try {
            $dsn = "mysql:host=" . $this->host . 
                   ";port=" . $this->port . 
                   ";dbname=" . $this->db_name . 
                   ";charset=utf8mb4";
            
            $this->conn = new PDO(
                $dsn,
                $this->username,
                $this->password,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                    PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT => false
                ]
            );
        } catch(PDOException $exception) {
            // Log error securely (don't expose in production)
            error_log("Database connection error: " . $exception->getMessage());
            
            // In production, show generic error
            if (getenv('MYSQLDATABASE') || getenv('DATABASE_URL')) {
                die("Database connection failed. Please try again later.");
            } else {
                // In development, show detailed error
                echo "Connection error: " . $exception->getMessage();
            }
        }
        
        return $this->conn;
    }
    
    // Helper method to check if running on Railway
    public function isProduction() {
        return (getenv('MYSQLDATABASE') || getenv('DATABASE_URL')) !== false;
    }
}
?>