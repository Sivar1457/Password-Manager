package passwordConvertor;

import java.io.BufferedReader;
import java.io.InputStreamReader;

public class AsymmetricConvertor {

    public String encryption(String pass , String publicKey) {
        String command = String.format("echo \"%s\" | age -a -r \"%s\"",pass,publicKey) ;
        ProcessBuilder pb = new ProcessBuilder("bash","-c",command);
        try {
            Process process = pb.start();
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder sb = new StringBuilder();
            String line ;
            while ( (line = reader.readLine()) != null ) {
                sb.append(line).append("\n");
            }
            process.waitFor();
            return sb.toString();
        }
        catch (Exception e) {
            System.out.println(e.getMessage());
            e.printStackTrace();
        }
        return "" ;
    }

    public String decryption(String encryptedPass , String privateKey) {
        String command = "" ;
        ProcessBuilder pb = new ProcessBuilder(command);
        try {
            Process process = pb.start();
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder sb = new StringBuilder();
            String line;
            while ( (line= reader.readLine()) != null ) {
                sb.append(line);
            }
            process.waitFor();
            return sb.toString();
        } catch (Exception e) {
            System.out.println(e.getMessage());
            e.printStackTrace();
        }
        return "";
    }

    public static void main(String[] args) {

    }

}
