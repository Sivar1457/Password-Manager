package passwordConvertor;

import java.io.BufferedReader;
import java.io.InputStreamReader;

public class SymmetricConvertor {

    public String encrption(String pass , String passphrase) {
        String command = String.format("expect -c '                                    spawn sh -c \"echo \\\"%s\\\" | age -p -a\"\n" +
                "expect \"Enter passphrase\"\n" +
                "send \"%s\\r\"\n" +
                "expect \"Confirm passphrase\"\n" +
                "send \"%s\\r\"\n" +
                "expect eof\n'",pass,passphrase,passphrase);
        ProcessBuilder pb = new ProcessBuilder("bash","-c",command);
        try {
            Process process = pb.start();
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder sb = new StringBuilder();
            String line ;
            boolean cond = false ;
            while ( (line = reader.readLine()) != null ) {
                if ( line.startsWith("-") ) {
                    cond = true ;
                }
                if ( cond ) {
                    sb.append(line).append("\n");
                }
            }
            process.waitFor();
            return sb.toString();
        } catch (Exception e) {
            System.out.println(e.getMessage());
            e.printStackTrace();
        }
        return "";
    }

    public boolean decrption(String pass , String passphrase) {
        String command = String.format("expect -c '                                    spawn sh -c \"echo \\\"%s\\\" | age -d\"\n" +
                "expect \"Enter passphrase\"\n" +
                "send \"%s\\r\"\n" +
                "expect eof\n" +
                "'",pass,passphrase) ;
        ProcessBuilder pb = new ProcessBuilder("bash","-c",command);
        try {
            Process process = pb.start();
            BufferedReader br = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            while ( (line = br.readLine()) != null ) {
                if ( line.contains("incorrect passphrase") ) return false ;
            }
            return true;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            e.printStackTrace();
        }
        return false;
    }

    public static void main(String[] args) {
        SymmetricConvertor convertor = new SymmetricConvertor();
        String[] arr = new String[2];
        arr[1] = "Hi" ;
        arr[0] = "Hello" ;
        arr[0] = convertor.encrption(arr[0],"siva");
        System.out.println(arr[0]);
        System.out.println(convertor.decrption(arr[0],"siva"));
    }

}
